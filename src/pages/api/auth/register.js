import { db } from "../../../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, contactNo, password } = req.body;

  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const existingUserSnapshot = await getDocs(userQuery);

    if (!existingUserSnapshot.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = {
      name,
      email,
      contactNo,
      password: hashedPassword,
      verified: false,
      verificationToken,
    };

    const userDoc = await addDoc(usersCollection, newUser);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Email sending function using Nodemailer
async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Secure port for SMTP
    secure: true, // Use TLS
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email address
      pass: process.env.EMAIL_PASS, // Your Gmail app-specific password
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_PORT}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <div style="width: 100%; max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center; font-family: Arial, sans-serif;">
  
        <!-- Title Section -->
        <h1 style="font-size: 1.8rem; color: #333; margin-bottom: 10px;">Verify your email address</h1>
        <p style="font-size: 1rem; color: #555; line-height: 1.5; margin-bottom: 20px;">
          Thank you for creating an account on our platform. We have sent a verification email to your registered email address. Please confirm your email to start using our services for generating invoices, including bulk invoice creation. Once verified, you can access all features seamlessly!
        </p>
  
        <!-- Button Section -->
        <a href="${verificationUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 1rem; font-weight: bold; margin-bottom: 20px; transition: background-color 0.3s ease;">Verify my email</a>
  
        <!-- Alternate Link Section -->
        <p style="font-size: 0.9rem; color: #666; margin-top: 20px;">
          Or paste this link into your browser:<br />
          <a href="${verificationUrl}" style="color: #007bff; text-decoration: none;">${verificationUrl}</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
