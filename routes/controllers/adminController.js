const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { compare, hash } = require("bcrypt");
const { isValidObjectId } = require("mongoose");
dotenv.config();

const login = async (req, res, next) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) {
    return res.json({
      message: "Error",
      data: "Unauthorized",
    });
  }
  const isMatch = await compare(req.body.password, admin.password);
  if (!isMatch) {
    return res.json({
      message: "Error",
      data: "Credential error",
    });
  }
  const token = await jwt.sign(
    { username: req.body.username, password: req.body.password },
    process.env.JWT_SECRET_KEY
  );
  res.json({ message: "Success", data: { token, level: admin.level } });
};

const getUsers = async (req, res, next) => {
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
  const validateEmailUsername = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });
  if (validateEmailUsername) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    }
    return res.json({
      message: "Error",
      data: "Email or Username already in use",
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
  if (!saveUser) {
    fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    return res.json({
      message: "Error",
      data: "Cannot saving user",
    });
  }
  return res.json({
    message: "Success",
    data: "User has been created",
  });
};

const updateUser = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId(_id)) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    }
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
  if (req.file) {
    req.body.image = req.file.path;
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id },
    { ...req.body },
    { useFindAndModify: false }
  );
  if (!updatedUser) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
    }
    return res.json({
      message: "Error",
      data: "Cannot update user",
    });
  }
  return res.json({
    message: "Success",
    data: updatedUser,
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
  const deletedUser = await User.findOneAndRemove(
    { _id },
    { useFindAndModify: false }
  );
  if (!deletedUser) {
    return res.json({
      message: "Error",
      data: "Error on deleting user",
    });
  }
  fs.unlinkSync(path.join(__dirname, `../../${deletedUser.image}`));
  return res.json({
    message: "Success",
    data: deletedUser,
  });
};

const getTransactions = async (req, res, next) => {
  const transactions = await Transaction.find();
  if (!transactions) {
    return res.json({
      message: "Error",
      data: "Failed fetching transaction",
    });
  }
  return res.json({
    message: "Success",
    data: transactions,
  });
};

const getTransaction = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId(_id)) {
    return res.json({
      message: "Error",
      data: "Invalid identifier",
    });
  }
  const transaction = await Transaction.findOne({ _id });
  if (!transaction) {
    return res.json({
      message: "Error",
      data: "Failed fetching transaction",
    });
  }
  return res.json({
    message: "Success",
    data: transaction,
  });
};

const addTransaction = async (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
  }
  if (
    !req.body.title ||
    !req.body.desc ||
    !req.body.amount ||
    !req.body.due_date ||
    !req.body.ref_code ||
    !req.body.usersId ||
    req.body.usersId.length === 0
  ) {
    return res.json({
      message: "Error",
      data: "Fill out the fields",
    });
  }
  const insertedUser = [];
  for (let i = 0; i < req.body.usersId.length; i++) {
    if (!isValidObjectId(req.body.usersId[i])) {
      return res.json({ message: "Error", data: "Invalid identifier" });
    }
    const checkUserId = await User.findOne({ _id: req.body.usersId[i] });
    if (!checkUserId) {
      return res.json({
        message: "Error",
        data: "Cannot find user",
      });
    }
    insertedUser.push({ user_id: req.body.usersId[i] });
  }
  const data = {
    title: req.body.title,
    desc: req.body.desc,
    amout: req.body.amount,
    due_date: req.body.due_date,
    ref_code: req.body.ref_code,
    users: insertedUser,
  };
  const transaction = new Transaction({
    ...data,
  });
  const saving = await transaction.save();
  if (!saving) {
    return res.json({
      message: "Error",
      data: "Cannot save for some reason",
    });
  }
  return res.json({
    message: "Success",
    data: saving,
  });
};

const verifyUserTransaction = async (req, res, next) => {
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
  if (req.body.userId && !req.body.usersId) {
    const transaction = await Transaction.findOneAndUpdate(
      { _id, "users.user_id": req.body.userId },
      { $set: { "users.$.is_complete": true } }
    );
    if (!transaction) {
      return res.json({
        message: "Error",
        data: "Error on updating",
      });
    }
    return res.json({
      message: "Success",
      data: transaction,
    });
  } else if (req.body.usersId && !req.body.userId) {
    const usersId = [
      req.body.usersId.map((userId) => {
        return { user_id: userId };
      }),
    ];
    const transaction = await Transaction.findOneAndUpdate(
      { _id },
      { $set: { "users.$[elem].is_complete": true } },
      { arrayFilters: usersId, multi: true },
      { useFindAndModify: false }
    );
    if (!transaction) {
      return res.json({
        message: "Error",
        data: "Error on updating",
      });
    }
    return res.json({
      message: "Success",
      data: transaction,
    });
  }
  return res.json({
    message: "Error",
    data: "Unknown fields",
  });
};

const deleteTransaction = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId(_id)) {
    return res.json({
      message: "Error",
      data: "Invalid identifier",
    });
  }
  const transaction = await Transaction.findOneAndRemove(
    { _id },
    { useFindAndModify: false }
  );
  if (!transaction) {
    return res.json({
      message: "Error",
      data: "Failed fetching transaction",
    });
  }
  transaction.users.map((user) => {
    const removeImage = fs.unlinkSync(
      path.join(__dirname, `../../${user.image}`)
    );
  });
  return res.json({
    message: "Success",
    data: transaction,
  });
};

module.exports = {
  login,
  registerUser,
  updateUser,
  deleteUser,
  getUsers,
  getTransactions,
  getTransaction,
  addTransaction,
  verifyUserTransaction,
  deleteTransaction,
};
