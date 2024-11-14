import withSession from "../../../lib/withSession";

export default async function handler(req, res) {
  // Apply the withSession middleware to validate the session
  await withSession(req, res, () => {
    // This will only run if the session validation passes
    res.status(200).json({ message: "Access granted", user: req.user });
  });
}
