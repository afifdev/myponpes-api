const User = require("../../models/User");
const dotenv = require("dotenv");
const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");
dotenv.config();

const getUsers = async (req, res, next) => {
  const user = await User.find();
  if (user) {
    return res.json({
      message: "Success",
      data: user,
    });
  }
  res.json({
    message: "Error",
    data: "User not found",
  });
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.json({
      message: "Success",
      data: user,
    });
  }
  res.json({
    message: "Error",
    data: "User not found",
  });
};

const register = async (req, res, next) => {
  const admin = await Admin.findOne({ username: req.body.authUsername });
  if (admin) {
    const isMatch = await compare(req.body.authPassword, admin.password);
    if (isMatch) {
      const data = req.body;
      if (
        !data.username ||
        !data.password ||
        !data.email ||
        !data.name ||
        !data.born_date ||
        !data.born_place ||
        !data.gender ||
        !data.address ||
        !data.phone_number ||
        !data.parent_name ||
        !data.parent_phone_number ||
        !req.file ||
        !data.date_in ||
        !data.active_until
      ) {
        return res.json({
          message: "Error",
          data: "Please fill out the fields",
        });
      }
      data.level = 0;
      data.image = req.file.path;
      data.gender = req.body.gender === "true";
      data.password = await hash(req.body.password, 12);
      console.log(data);
      const user = new User({
        ...data,
      });
      const saved = user.save();
      if (saved) {
        return res.json({
          message: "Success",
          data: saved,
        });
      }
      return res.json({
        message: "Error",
        data: "Could not save new user",
      });
    }
    return res.json({
      message: "Error",
      data: "Invalid credentials",
    });
  }
  return res.json({
    message: "Error",
    data: "Unauthorized",
  });
};

const updateUser = (req, res, next) => {
  return next();
};

const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then((r) => {
      res.json({
        message: "Success",
        data: r,
      });
    })
    .catch((e) => {
      res.json({
        message: "Error",
        data: e,
      });
    });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const isMatch = await compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          username,
          password,
        },
        process.env.JWT_SECRET_KEY
      );
      return res.json({
        message: "Success",
        data: {
          token,
          level: user.level,
        },
      });
    }
    return res.json({
      message: "Error",
      data: "Password mismatch",
    });
  }
  return res.json({
    message: "Error",
    data: "User not found",
  });
};

module.exports = { getUsers, getUser, updateUser, deleteUser, login, register };
