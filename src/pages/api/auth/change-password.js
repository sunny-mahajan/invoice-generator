import { db } from "../../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { verifyToken } from "../../../lib/verifyToken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    // Use `verifyToken` to authenticate the user
    verifyToken(req, res, async () => {
      console.log(req.user, "req.user");
      const userId = req.user.id; // Extract user ID from the token's payload

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Fetch the user from Firestore
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userDoc.data();

      // Compare current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      if (currentPassword === newPassword) {
        return res
          .status(400)
          .json({
            error: "New password cannot be the same as the current password",
          });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in Firestore
      await updateDoc(userRef, { password: hashedPassword });

      res.status(200).json({ message: "Password updated successfully" });
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
