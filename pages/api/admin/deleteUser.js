import dbConnect from "../../../server/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const users = await User.deleteOne({ _id: req.body._id });
    if (users)
      res
        .status(200)
        .json({ success: true, message: "Хэрэглэгчийн мэдээллийг устгалаа" });
    else res.status(500).json({ success: false, message: "алдаа гарлаа :( " });
  } catch (error) {
    res.status(500).json({ success: false, message: "алдаа гарлаа :( " });
  }
}
