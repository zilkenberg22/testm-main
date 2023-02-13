import dbConnect from "../../../server/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const users = await User.find({});
    if (users) res.status(200).json({ success: true, users });
    else res.status(500).json({ success: false, message: "aldaa" });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
