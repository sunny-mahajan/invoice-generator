import { db } from "../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  try {
    // Check if the user exists
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;

    // Set token expiration (1 hour from now)
    const tokenExpiry = Date.now() + 3600000;

    // Update user document with reset token and expiry
    await updateDoc(userRef, {
      resetToken,
      tokenExpiry,
    });

    // Send password reset email
    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Email sending function using Nodemailer
async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_PORT}/auth/reset-password?token=${token}&email=${email}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center; font-family: Arial, sans-serif;">
        <h2 style="color: #333333;">Password Reset</h2>
        <p style="color: #555555;">If you've lost your password or wish to reset it, use the link below to get started.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
        <p style="color: #555555;">This link is valid for 1 hour.</p>
        <p style="font-size: 12px; color: #666666;">
          If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
