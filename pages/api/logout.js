import dbConnect from "../../server/dbConnect";
import UserToken from "../../models/UserToken";

export default async function handler(req, res) {
  await dbConnect();

  try {
    // const userToken = await UserToken.findOneAndDelete({ token: req.body.refreshToken });
    // if (!userToken) return res.status(200).json({ error: false, message: "Системээс гарлаа" });

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Sucessfully" });

    await userToken.remove();
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, message: "Сервер ачааллах боломжгүй байна" });
  }
}
