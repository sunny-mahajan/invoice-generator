// pages/api/auth/protected.js
import { verifyToken } from "../../../lib/verifyToken";

export default async function handler(req, res) {
  verifyToken(req, res, () => {
    if (!req.user.verified) {
      return res.status(403).json({ message: "Email not verified", user: req.user });
    }
    res.status(200).json({ message: "Access granted", user: req.user });
  });
}
