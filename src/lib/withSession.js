import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default async function withSession(req, res, next) {
  const sessionId = req.headers["authorization"]; // Get session ID from the request headers
  console.log(req.user, "userData");
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" }); // If no session ID, return unauthorized error
  }

  try {
    // Query Firestore to verify the sessionId
    const userRef = doc(db, "users", req.body.email); // Assuming the user's email is passed in the body (or use the sessionId for lookup)
    const userSnapshot = await getDoc(userRef);
    // If user doesn't exist or sessionId doesn't match, reject
    if (!userSnapshot.exists() || userSnapshot.data().sessionId !== sessionId) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    // Attach user data to the request
    req.user = userSnapshot.data();

    // Call the next function (proceed to the handler)
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" }); // Internal error if anything fails
  }
}
