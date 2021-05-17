const { compare } = require("bcrypt");
const Admin = require("../models/Admin");
const fs = require("fs");
const path = require("path");

const checkAdmin = async (req, res, next) => {
  const authAdmin = await Admin.findOne({ username: req.body.authUsername });
  if (!authAdmin) {
    if (req.file) {
      const removeImage = fs.unlinkSync(
        path.join(__dirname, `../../${req.file.path}`)
      );
    }
    return res.json({
      message: "Error",
      data: "Unauthorized",
    });
  }
  const isMatch = await compare(req.body.authPassword, authAdmin.password);
  if (!isMatch) {
    if (req.file) {
      const removeImage = fs.unlinkSync(
        path.join(__dirname, `../../${req.file.path}`)
      );
    }
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  return next();
};

module.exports = checkAdmin;
