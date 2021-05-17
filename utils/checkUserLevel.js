const { compare } = require("bcrypt");
const User = require("../models/User");

const checkUserLevel = async (req, res, next) => {
  const leveledUser = await User.findOne({ username: req.body.authUsername });
  if (!leveledUser || leveledUser.level === 0) {
    return res.json({
      message: "Error",
      data: "Unauthorized",
    });
  }
  const isMatch = await compare(req.body.authPassword, leveledUser.password);
  if (!isMatch) {
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  req.body.validateLeveledUser = leveledUser;
  return next();
};

module.exports = checkUserLevel;
