import bcrypt from "bcrypt";
import dbConnect from "../../server/dbConnect";
import User from "../../models/User";
import generateTokens from "../../tools/generateTokens";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "И-Майл эсвэл нууц үг таарахгүй байна" });

    const verifiedPassword = await bcrypt.compare(password, user.password);
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "И-Майл эсвэл нууц үг таарахгүй байна" });

    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Амжилттай нэвтэрлээ",
      data: user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, message: "Сервер ачааллах боломжгүй байна" });
  }
}
