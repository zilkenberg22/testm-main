import crypto from "crypto";
import Tokens from "csrf";

const tokens = new Tokens();

export const csrfMiddleware = (req, res, next) => {
  const secret =
    process.env.CSRF_SECRET || crypto.randomBytes(16).toString("hex");
  const csrfToken = tokens.create(secret);
  res.setHeader("Set-Cookie", `csrfToken=${csrfToken}; Path=/`);
  req.csrfToken = csrfToken;
  next();
};

export const csrfCheckMiddleware = (req, res, next) => {
  const csrfToken = req.cookies.csrfToken || "";
  if (!tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next();
};
