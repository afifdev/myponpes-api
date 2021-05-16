const Admin = require("../../models/Admin");
const User = require("../../models/User");
const { compare, hash } = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { isValidObjectId } = require("mongoose");
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

const getUsers = async (req, res, next) => {
  const authAdmin = await Admin.findOne({ username: req.body.authUsername });
  if (!authAdmin) {
    return res.json({
      message: "Error",
      data: "Unauthorized",
    });
  }
  const isMatch = await compare(req.body.authPassword, authAdmin.password);
  if (!isMatch) {
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  const user = await User.find();
  return res.json({
    message: "Success",
    data: user,
  });
};

const registerUser = async (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
  }
  const authAdmin = await Admin.findOne({ username: req.body.authUsername });
  if (authAdmin) {
    const isMatch = await compare(req.body.authPassword, authAdmin.password);
    if (!isMatch) {
      return res.json({
        message: "Error",
        data: "Credential Error",
      });
    }
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
    data.level = data.level ? data.level : 0;
    data.image = req.file.path;
    data.gender = req.body.gender === "true";
    data.password = await hash(req.body.password, 12);

    const user = new User({
      ...data,
    });
    const saveUser = user.save();
    if (saveUser) {
      return res.json({
        message: "Success",
        data: "User has been created",
      });
    } else {
      return res.json({
        message: "Error",
        data: "Cannot saving user",
      });
    }
  } else {
    return res.json({
      message: "Error",
      data: "Unauthorized",
    });
  }
};

const updateUser = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId(_id)) {
    return res.json({
      message: "Error",
      data: "Invalid identifier",
    });
  }
  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.progress) {
    delete req.body.progress;
  }
  if (req.body.payment) {
    delete req.body.payment;
  }
  console.log(req.body);
  const authAdmin = await Admin.findOne({ username: req.body.authUsername });
  if (authAdmin) {
    const isMatch = await compare(req.body.authPassword, authAdmin.password);
    if (!isMatch) {
      return res.json({
        message: "Error",
        data: "Credential Error",
      });
    }
    const prevUserData = await User.findOne(
      { _id },
      { _id: 0, progress: 0, payment: 0 }
    );
    if (req.file) {
      const removePrevImage = fs.unlinkSync(
        path.join(__dirname, `../../${prevUserData.image}`)
      );
      req.body.image = req.file.path;
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { ...req.body },
      { useFindAndModify: false }
    );
    if (updatedUser) {
      return res.json({
        message: "Success",
        data: updatedUser,
      });
    }
    return res.json({
      message: "Error",
      data: "Failed on update",
    });
  }
  return res.json({
    message: "Error",
    data: "Unauthorized",
  });
};

const deleteUser = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId(_id)) {
    return res.json({
      message: "Error",
      data: "Invalid identifier",
    });
  }
  const authAdmin = await Admin.findOne({ username: req.body.authUsername });
  if (authAdmin) {
    const isMatch = await compare(req.body.authPassword, authAdmin.password);
    if (!isMatch) {
      return res.json({
        message: "Error",
        data: "Credential Error",
      });
    }
    const deletedUser = await User.findOneAndRemove(
      { _id },
      { useFindAndModify: false }
    );
    if (deleteUser) {
      fs.unlink(path.join(__dirname, `../../${deleteUser.image}`));
      return res.json({
        message: "Success",
        data: deletedUser,
      });
    }
    return res.json({
      message: "Error",
      data: "Error on deleting",
    });
  }
  return res.json({
    message: "Error",
    data: "Unauthorized",
  });
};
module.exports = { login, registerUser, updateUser, deleteUser, getUsers };
