import crypto from "crypto";
import Tokens from "csrf";
import Cookies from "js-cookie";

const tokens = new Tokens();

export const csrfMiddleware = () => {
  const secret =
    process.env.CSRF_SECRET || crypto.randomBytes(16).toString("hex");
  const csrfToken = tokens.create(secret);
  Cookies.set("csrfToken", csrfToken);
  return csrfToken;
};

export const csrfCheckMiddleware = (req, res, next) => {
  const csrfToken = req.cookies.csrfToken || "";
  if (!tokens.verify(process.env.CSRF_SECRET, csrfToken)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next();
};
