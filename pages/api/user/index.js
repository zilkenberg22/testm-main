import dbConnect from "../../../server/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import generateTokens from "../../../tools/generateTokens";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Logged in sucessfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}
