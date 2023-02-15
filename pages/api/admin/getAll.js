import dbConnect from "../../../server/dbConnect";
import User from "../../../models/User";
import { verifyAccessToken } from "../../../middleware/auth";

export default (req, res) => {
  verifyAccessToken(req, res, () => {
    handler(req, res);
  });
};

async function handler(req, res) {
  try {
    await dbConnect();
    const users = await User.find({});
    if (users) res.status(200).json({ success: true, users });
    else res.status(500).json({ success: false, message: "Алдаа гарлаа :( " });
  } catch (error) {
    res.status(500).json({ success: false, message: "Алдаа гарлаа :( " });
  }
}
