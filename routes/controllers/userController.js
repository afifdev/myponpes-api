const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { compare } = require("bcrypt");
const { isValidObjectId } = require("mongoose");
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
  const user = req.body.validateUser;
  res.json({
    message: "Success",
    data: user,
  });
};

const updateUser = async (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
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
  if (req.file) {
    fs.unlinkSync(path.join(__dirname, `../../${user.image}`));
  }
  return res.json({
    message: "Success",
    data: updatedUser,
  });
};

const getMyTransaction = async (req, res, next) => {
  const user = req.body.validateUser;
  const myTransaction = await Transaction.find(
    { "users.user_id": user.id },
    {
      title: 1,
      desc: 1,
      due_date: 1,
      ref_code: 1,
      users: { $elemMatch: { user_id: user.id } },
    }
  );
  if (!myTransaction) {
    return res.json({
      message: "Error",
      data: "Failed to fetch",
    });
  }
  return res.json({
    message: "Success",
    data: myTransaction,
  });
};

const updateMyTransaction = async (req, res, next) => {
  const _id = req.params.id;
  if (!req.file) {
    return res.json({
      message: "Error",
      data: "Image should uploaded",
    });
  }
  if (!isValidObjectId(_id)) {
    fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    return res.json({
      message: "Error",
      data: "Invalid Identifier",
    });
  }
  if (req.body._id) {
    delete req.body._id;
  }
  const user = req.body.validateUser;
  const date = new Date().toISOString().split("T")[0];
  const myTransaction = await Transaction.findOneAndUpdate(
    { _id, "users.user_id": user.id },
    { $set: { "users.$.payment_date": date, "users.$.image": req.file.path } },
    { useFindAndModify: false }
  );
  if (!myTransaction) {
    fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    return res.json({
      message: "Error",
      data: "Cannot update",
    });
  }
  return res.json({
    message: "Success",
    data: myTransaction,
  });
};

const withLevelGetUsers = async (req, res, next) => {
  const leveledUser = req.body.validateLeveledUser;
  const users = await User.find();
  if (!users) {
    return res.json({
      message: "Error",
      data: "Cannot fetch",
    });
  }
  return res.json({
    message: "Success",
    data: users,
  });
};

const withLevelAddHafalan = async (req, res, next) => {
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
  const leveledUser = req.body.validateLeveledUser;
  const date = new Date().toISOString().split("T")[0];
  const newHafalan = {
    creator_id: leveledUser._id,
    date,
    juz: req.body.juz,
    surat: req.body.surat,
    ayat: req.body.ayat,
  };
  const user = await User.findOneAndUpdate(
    { _id },
    { $push: { hafalan: newHafalan } }
  );
  if (!user) {
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

const withLevelAddKitab = async (req, res, next) => {
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
  const leveledUser = req.body.validateLeveledUser;
  const date = new Date().toISOString().split("T")[0];
  const newKitab = {
    creator_id: leveledUser._id,
    name: req.body.name,
    max_page: req.body.max_page,
    date,
    current_page: req.body.current_page,
  };
  const user = await User.findOneAndUpdate(
    { _id },
    { $push: { kitab: newKitab } }
  );
  if (!user) {
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

const withLevelAddAchievement = async (req, res, next) => {
  if (!req.file) {
    return res.json({
      message: "Error",
      data: "Image should uploaded",
    });
  }
  const _id = req.params.id;
  if (!isValidObjectId(_id)) {
    fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    return res.json({
      message: "Error",
      data: "Invalid identifier",
    });
  }
  if (req.body._id) {
    delete req.body._id;
  }
  const leveledUser = req.body.validateLeveledUser;
  const date = new Date().toISOString().split("T")[0];
  const newAchievement = {
    creator_id: leveledUser._id,
    title: req.body.title,
    event: req.body.event,
    image: req.file.path,
  };
  const user = await User.findOneAndUpdate(
    { _id },
    { $push: { achievement: newAchievement } }
  );
  if (!user) {
    const removeImage = fs.unlinkSync(
      path.join(__dirname, `../../${req.file.path}`)
    );
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

const withLevelAddReturning = async (req, res, next) => {
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
  const leveledUser = req.body.validateLeveledUser;
  const date = new Date();
  const newReturning = {
    creator_id: leveledUser._id,
    kind: req.body.kind,
    date: date.toISOString().split("T")[0],
    return_due_date: date
      .setDate(date.getDate() + parseInt(req.body.duration))
      .toISOString()
      .split("T")[0],
    isReturn: false,
  };
  const user = await User.findOneAndUpdate(
    { _id },
    { $push: { returning: newReturning } }
  );
  if (!user) {
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

const withLevelUpdateReturning = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId(_id) || !isValidObjectId(req.body.return_id)) {
    return res.json({
      message: "Error",
      data: "Invalid identifier",
    });
  }
  if (req.body._id) {
    delete req.body._id;
  }
  const leveledUser = req.body.validateLeveledUser;
  const return_date = new Date().toISOString().split("T")[0];
  const user = await User.findOneAndUpdate(
    { _id, "progress.returning._id": req.body.return_id },
    {
      $set: {
        "progress.returning.$.return_date": return_date,
        "progress.returning.$.is_return": true,
      },
    },
    { useFindAndModify: false }
  );
  if (!user) {
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

const withLevelAddJamaah = async (req, res, next) => {
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
  const leveledUser = req.body.validateLeveledUser;
  const date = new Date().toISOString().split("T")[0];
  const newJamaah = {
    creator_id: leveledUser._id,
    kind: req.body.kind,
    date,
    is_attend: req.body.is_attend === true,
  };
  const user = await User.findOneAndUpdate(
    { _id },
    { $push: { "attendance.jamaah": newJamaah } }
  );
  if (!user) {
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

const withLevelAddNgaji = async (req, res, next) => {
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
  const leveledUser = req.body.validateLeveledUser;
  const date = new Date().toISOString().split("T")[0];
  const newNgaji = {
    creator_id: leveledUser._id,
    kind: req.body.kind,
    date,
    is_attend: req.body.is_attend === true,
  };
  const user = await User.findOneAndUpdate(
    { _id },
    { $push: { "attendance.ngaji": newNgaji } }
  );
  if (!user) {
    return res.json({
      message: "Error",
      data: "Failed to update",
    });
  }
  return res.json({
    message: "Error",
    data: user,
  });
};

module.exports = {
  loginUser,
  getUser,
  updateUser,
  getMyTransaction,
  updateMyTransaction,
  withLevelGetUsers,
  withLevelAddHafalan,
  withLevelAddKitab,
  withLevelAddAchievement,
  withLevelAddReturning,
  withLevelUpdateReturning,
  withLevelAddJamaah,
  withLevelAddNgaji,
};
