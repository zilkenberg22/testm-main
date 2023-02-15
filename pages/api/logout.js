import dbConnect from "../../server/dbConnect";
import UserToken from "../../models/UserToken";
import { verifyRefreshToken } from "../../middleware/auth";

export default (req, res) => {
  verifyRefreshToken(req, res, () => {
    handler(req, res);
  });
};

async function handler(req, res) {
  await dbConnect();
  try {
    const refreshToken = req.body;
    const userToken = await UserToken.findOne({
      token: refreshToken,
    });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Системээс гарлаа" });

    await userToken.remove();
    res.status(200).json({ error: false, message: "Системээс гарлаа" });
  } catch (err) {
    res.status(500).json({ error: true, message: "Алдаа гарлаа :( " });
  }
}
