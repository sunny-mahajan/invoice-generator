// lib/verifyToken.js
import jwt from "jsonwebtoken";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    ), // Add your Firebase Admin credentials here
  });
}

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (firebaseError) {
      console.warn("Not a Firebase ID token:", firebaseError.message);

      // If it fails, try to verify it as a custom JWT (email-password login)
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        console.error(
          "Failed to verify both Firebase and custom JWT:",
          jwtError.message
        );
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
