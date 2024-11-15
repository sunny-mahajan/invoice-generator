// // pages/api/auth/register.js
// import { db } from "../../../../firebaseConfig";
// import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { name, email, contactNo, password } = req.body;

//   try {
//     const usersCollection = collection(db, "users");
//     const userQuery = query(usersCollection, where("email", "==", email));
//     const existingUserSnapshot = await getDocs(userQuery);

//     if (!existingUserSnapshot.empty) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = {
//       name,
//       email,
//       contactNo,
//       password: hashedPassword,
//     };

//     const userDoc = await addDoc(usersCollection, newUser);

//     // Create JWT token
//     const token = jwt.sign(
//       { id: userDoc.id, email, name },
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     res.status(201).json({ message: "User registered successfully", token });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

import { db } from "../../../../firebaseConfig";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
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

    res.status(201).json({ message: "User registered successfully. Please verify your email." });
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
    html: `<h1>Email Verification</h1>
           <p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">Verify Email</a>`,
  };

  await transporter.sendMail(mailOptions);
}
