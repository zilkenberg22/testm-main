import dbConnect from "../../server/dbConnect";
import User from "../../models/User";
import { verifyAccessToken } from "../../middleware/auth";

export default (req, res) => {
  verifyAccessToken(req, res, () => {
    handler(req, res);
  });
};

async function handler(req, res) {
  try {
    await dbConnect();
    const user = await User.findByIdAndUpdate(req.user._id, req.body);
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Хэрэглэгчийн мэдээлэл олдсонгүй" });
    res.status(200).json({
      error: false,
      message: "Амжилттай заслаа",
    });
  } catch (err) {
    res.status(500).json({ error: true, message: "Алдаа гарлаа :( " });
  }
}
