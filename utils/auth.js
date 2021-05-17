const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.body.authUsername = user.username;
        req.body.authPassword = user.password;
        return next();
      } catch (err) {
        return res.json({
          message: "Error",
          data: "Invalid or Expired Token",
        });
      }
    }
    return res.json({
      message: "Error",
      data: "Token should be: Bearer [token]",
    });
  }
  return res.json({
    message: "Error",
    data: "Token must be provided",
  });
};

module.exports = auth;
