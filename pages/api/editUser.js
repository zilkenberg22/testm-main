import dbConnect from "../../server/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const user = await User.findByIdAndUpdate(req.body._id, req.body);
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Хэрэглэгчийн мэдээлэл олдсонгүй" });

    res.status(200).json({
      error: false,
      message: "Амжилттай заслаа",
      data: user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, message: "Сервер ачааллах боломжгүй байна" });
  }
}
