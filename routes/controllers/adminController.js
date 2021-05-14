const Admin = require("../../models/Admin");
const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res, next) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (admin) {
    const isMatch = await compare(req.body.password, admin.password);
    if (isMatch) {
      const token = await jwt.sign(
        { username: req.body.username, password: req.body.password },
        process.env.JWT_SECRET_KEY
      );
      res.json({ message: "Success", data: { token, level: admin.level } });
    } else {
      const err = new Error();
      err.message = "Error on password";
      err.data.error = "Password mismatch";
      next(err);
    }
  } else {
    const err = new Error();
    err.message = "Error occured";
    err.data.error = "Admin not found";
    next(err);
  }
};

module.exports = { login };
