import jwt from "jsonwebtoken";

const verifyAccessToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(403)
      .json({
        error: true,
        message: "Таны хандалтын эрх дууссан тул нэвтэрнэ үү",
      });

  try {
    const tokenDetails = jwt.verify(
      token.split(" ")[1],
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = tokenDetails;
    next();
  } catch (err) {
    res
      .status(403)
      .json({
        error: true,
        message: "Таны хандалтын эрх дууссан тул нэвтэрнэ үү",
      });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const token = req.body;
  if (!token)
    return res
      .status(403)
      .json({
        error: true,
        message: "Таны хандалтын эрх дууссан тул нэвтэрнэ үү",
      });

  try {
    const tokenDetails = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    req.user = tokenDetails;
    next();
  } catch (err) {
    res
      .status(403)
      .json({
        error: true,
        message: "Таны хандалтын эрх дууссан тул нэвтэрнэ үү",
      });
  }
};

export { verifyAccessToken, verifyRefreshToken };
