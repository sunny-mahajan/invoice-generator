import { db } from "../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.query;

  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("verificationToken", "==", token)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const userDoc = userSnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    await updateDoc(userRef, {
      verified: true,
      verificationToken: null,
      id: userDoc.id,
    });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
