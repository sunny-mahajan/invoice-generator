import { db } from "../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, token, newPassword } = req.body;

  try {
    // Check if the user exists
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if the reset token matches and is not expired
    if (userData.resetToken !== token || Date.now() > userData.tokenExpiry) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await updateDoc(userDoc.ref, {
      password: hashedPassword,
      resetToken: null,
      tokenExpiry: null,
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
