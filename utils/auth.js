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
        req.body.auth.username = user.username;
        req.body.auth.password = user.password;
        return next();
      } catch (err) {
        const errors = new Error();
        errors.message = "Invalid/Expired token";
        return next(errors);
      }
    }
    const errors = new Error();
    errors.message = "Token should be: Bearer [token]";
    return next(errors);
  }
  const errors = new Error();
  errors.message = "Token must be provided";
  return next(errors);
};

module.exports = auth;
