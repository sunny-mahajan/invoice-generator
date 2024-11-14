// /api/auth/logout.js
import { db } from "../../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const sessionId = req.headers["authorization"];

  if (!sessionId) {
    return res.status(400).json({ error: "No session ID provided" });
  }

  // Update the user document to clear the sessionId
  const userRef = doc(db, "users", req.user.email); // Assuming email is the document ID
  await updateDoc(userRef, {
    sessionId: null, // Clear sessionId on logout
  });

  res.status(200).json({ message: "Logged out successfully" });
}
