const { compare } = require("bcrypt");
const User = require("../../models/User");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const loginUser = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.json({
      message: "Error",
      data: "Field must not be empty",
    });
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.json({
      message: "Error",
      data: "User not found",
    });
  }
  const isMatch = await compare(req.body.password, user.password);
  if (!isMatch) {
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  const token = await jwt.sign(
    { username: user.username, password: req.body.password },
    process.env.JWT_SECRET_KEY
  );
  res.json({
    message: "Success",
    data: {
      token,
      level: user.level,
    },
  });
};

const getUser = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.authUsername });
  if (!user) {
    return res.json({
      message: "Error",
      data: "User not found",
    });
  }
  const isMatch = await compare(req.body.authPassword, user.password);
  if (!isMatch) {
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  res.json({
    message: "Success",
    data: user,
  });
};

const updateUser = async (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
  }
  const user = await User.findOne({ username: req.body.authUsername });
  if (!user) {
    return res.json({
      message: "Error",
      data: "User not found",
    });
  }
  const isMatch = await compare(req.body.authPassword, user.password);
  if (!isMatch) {
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  const data = {
    email: req.body.email ? req.body.email : user.email,
    name: req.body.name ? req.body.name : user.name,
    phone_number: req.body.phone_number
      ? req.body.phone_number
      : user.phone_number,
    parent_phone_number: req.body.parent_phone_number
      ? req.body.parent_phone_number
      : user.parent_phone_number,
  };
  if (req.file) {
    const removeImage = fs.unlinkSync(
      path.join(__dirname, `../../${user.image}`)
    );
    data.image = req.file.path;
  }
  const updatedUser = await User.findOneAndUpdate(
    { username: req.body.authUsername },
    { ...data },
    { useFindAndModify: false }
  );
  if (!updatedUser) {
    return res.json({
      message: "Error",
      data: "Error on update",
    });
  }
  return res.json({
    message: "Success",
    data: updatedUser,
  });
};

module.exports = { loginUser, getUser, updateUser };
