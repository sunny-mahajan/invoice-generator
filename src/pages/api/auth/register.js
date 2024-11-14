// /pages/api/auth/register.js
import { db } from "../../../../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data
    await addDoc(usersCollection, {
      name,
      email,
      contactNo,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
