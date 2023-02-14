import jwt from "jsonwebtoken";

const verifyAccessToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(403)
      .json({ error: true, message: "Access Denied: No token provided 1" });

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
      .json({ error: true, message: "Access Denied: Invalid token 2" });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const token = req.body;
  if (!token)
    return res
      .status(403)
      .json({ error: true, message: "Access Denied: No token provided 1" });

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
      .json({ error: true, message: "Access Denied: Invalid token 2" });
  }
};

export { verifyAccessToken, verifyRefreshToken };
