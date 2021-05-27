const { compare } = require("bcrypt");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const checkUser = async (req, res, next) => {
  const user = await User.findOne(
    { username: req.body.authUsername },
    "username password"
  );
  if (!user) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    }
    return res.json({
      message: "Error",
      data: "User not found",
    });
  }
  const isMatch = await compare(req.body.authPassword, user.password);
  if (!isMatch) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    }
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  return next();
};

module.exports = checkUser;
