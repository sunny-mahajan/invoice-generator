// // /pages/api/auth/login.js
// import { db } from "../../../../firebaseConfig";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import bcrypt from "bcryptjs";
// import { signIn } from "next-auth/react";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { email, password } = req.body;
//   console.log(email, password, "email and password");
//   try {
//     const usersCollection = collection(db, "users");
//     const userQuery = query(usersCollection, where("email", "==", email));
//     const userSnapshot = await getDocs(userQuery);

//     if (userSnapshot.empty) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const userDoc = userSnapshot.docs[0];
//     const user = userDoc.data();

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log(isPasswordValid, "isPasswordValid");
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     // Sign in the user using next-auth
//     await signIn("credentials", {
//       redirect: false,
//       email: email,
//       password: password,
//     });
//     res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

import { db } from "../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate a new session ID
    const sessionId = uuidv4();

    // Reference the specific user document by its ID
    const userRef = doc(db, "users", userDoc.id);

    // Store sessionId in the user document
    await updateDoc(userRef, {
      sessionId: sessionId, // Add sessionId to user document
    });

    // Return success response with user data
    res.status(200).json({ message: "Login successful", sessionId: sessionId });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
