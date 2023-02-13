import jwt from "jsonwebtoken";
import dbConnect from "../../server/dbConnect";
import verifyRefreshToken from "../../tools/verifyRefreshToken";

export default async function handler(req, res) {
  await dbConnect();

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "14m" }
      );
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
}
