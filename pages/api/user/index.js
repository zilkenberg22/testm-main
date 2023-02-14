import dbConnect from "../../../server/dbConnect";
import User from "../../../models/User";
import { verifyAccessToken } from "../../../middleware/auth";

export default (req, res) => {
  verifyAccessToken(req, res, () => {
    handler(req, res);
  });
};

async function handler(req, res) {
  await dbConnect();
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({ accessToken, _id: req.user._id });
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
}
