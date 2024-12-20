// lib/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// lib/verifyToken.js
// import jwt from "jsonwebtoken";
// import admin from "firebase-admin";

// // Initialize Firebase Admin if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(
//       JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
//     ), // Add your Firebase Admin credentials here
//   });
// }

// export const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ error: "Access denied, token missing" });
//   }

//   try {
//     console.log(token, "token");
//     let decoded;
//     // if (token.startsWith("ey")) {
//     //   // Check if it's a JWT (email-password login)
//     //   decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // } else {
//     //   // Verify Firebase ID token (Google Sign-In)
//     //   decoded = await admin.auth().verifyIdToken(token);
//     // }
//     try {
//       decoded = await admin.auth().verifyIdToken(token);
//       console.log("Verified as Firebase ID token:", decoded);
//     } catch (firebaseError) {
//       console.warn("Not a Firebase ID token:", firebaseError.message);

//       // If it fails, try to verify it as a custom JWT (email-password login)
//       try {
//         decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Verified as custom JWT:", decoded);
//       } catch (jwtError) {
//         console.error(
//           "Failed to verify both Firebase and custom JWT:",
//           jwtError.message
//         );
//         return res.status(401).json({ error: "Invalid or expired token" });
//       }
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };
