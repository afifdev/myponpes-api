const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Payment = require("../../models/Payment");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { compare, hash } = require("bcrypt");
const { isValidObjectId } = require("mongoose");
dotenv.config();

const login = async (req, res, next) => {
  try {
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
      {
        username: req.body.username,
        password: req.body.password,
        level: admin.level,
      },
      process.env.JWT_SECRET_KEY
    );
    res.json({ message: "Success", data: { token, level: admin.level } });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  const username = req.query.username;
  if (!username || username === "") {
    return res.json({
      message: "Error",
      data: "Please check your username",
    });
  }
  try {
    const user = await User.find(
      {
        username: { $regex: new RegExp(username) },
      },
      { progress: 0, password: 0 }
    );
    return res.json({
      message: "Success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
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
      !data.active_until
    ) {
      return res.json({
        message: "Error",
        data: "Please fill out the fields",
      });
    }
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const checkUsernameEmailExist = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (
      req.body.email !== req.body.email.toLowerCase() ||
      req.body.username !== req.body.username.toLowerCase() ||
      /\s/g.test(req.body.email) ||
      /\s/g.test(req.body.username) ||
      !re.test(String(req.body.email)) ||
      checkUsernameEmailExist
    ) {
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, `../../${req.file.path}`));
      }
      return res.json({
        message: "Error",
        data: "Email and Username should be valid or it was exist",
      });
    }
    data.username = data.username.toLowerCase();
    const date = new Date();
    data.date_in = date.toISOString().split("T")[0];
    Date.prototype.addDays = function (days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    data.active_until = date
      .addDays(parseInt(data.active_until))
      .toISOString()
      .split("T")[0];
    data.level = data.level ? 1 : 0;
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
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
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
    if (req.body.username) {
      delete req.body.username;
    }
    if (req.body.email) {
      delete req.body.email;
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
    fs.unlinkSync(path.join(__dirname, `../../${updatedUser.image}`));
    return res.json({
      message: "Success",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const transactions = await Payment.find();
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
  } catch (err) {
    next(err);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const _id = req.params.id;
    if (!isValidObjectId(_id)) {
      return res.json({
        message: "Error",
        data: "Invalid identifier",
      });
    }
    const transaction = await Payment.findOne({ _id });
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
  } catch (err) {
    next(err);
  }
};

const addPayment = async (req, res, next) => {
  try {
    if (req.body._id) {
      delete req.body._id;
    }
    if (
      !req.body.title ||
      !req.body.desc ||
      !req.body.amount ||
      !req.body.due_date ||
      !req.body.ref_code ||
      !req.body.category ||
      !req.body.group ||
      !["all", "selected"].includes(req.body.group) ||
      !req.body.users_id ||
      req.body.users_id.length === 0
    ) {
      return res.json({
        message: "Error",
        data: "Fill out the fields",
      });
    }
    const prevRefCode = await Payment.find(
      { ref_code: req.body.ref_code },
      { ref_code: 1 }
    );
    if (prevRefCode) {
      return res.json({
        message: "Error",
        data: "ref_code should be unique",
      });
    }
    const insertedUser = [];
    if (req.body.group === "all") {
      const checkUsers = await User.find({}, { _id: 1 });
      checkUsers.map((u) => {
        insertedUser.push({ user_id: u._id });
      });
    } else {
      for (let i = 0; i < req.body.users_id.length; i++) {
        if (!isValidObjectId(req.body.users_id[i])) {
          return res.json({ message: "Error", data: "Invalid identifier" });
        }
        const checkUserId = await User.findOne(
          { _id: req.body.users_id[i] },
          { _id: 1 }
        );
        if (!checkUserId) {
          return res.json({
            message: "Error",
            data: "Cannot find user",
          });
        }
        insertedUser.push({ user_id: req.body.users_id[i] });
      }
    }
    const data = {
      title: req.body.title,
      desc: req.body.desc,
      amout: req.body.amount,
      due_date: req.body.due_date,
      ref_code: req.body.ref_code,
      category: req.body.category,
      users: insertedUser,
    };
    const transaction = new Payment({
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
  } catch (err) {
    next(err);
  }
};

const verifyUserPayment = async (req, res, next) => {
  try {
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
    if (req.body.update_type === "general") {
      if (
        !req.body.title ||
        !req.body.desc ||
        !req.body.amount ||
        !req.body.due_date ||
        !req.body.ref_code
      ) {
        return res.json({
          message: "Error",
          data: "Please fill the fields",
        });
      }
      const data = {
        title: req.body.title,
        desc: req.body.desc,
        amount: req.body.amount,
        due_date: req.body.due_date,
        ref_code: req.body.ref_code,
      };
      const transaction = await Payment.findOneAndUpdate({ _id }, { ...data });
      if (!transaction) {
        return res.json({
          message: "Error",
          data: "Cannot update",
        });
      }
      return res.json({
        message: "Success",
        data: transaction,
      });
    } else if (req.body.user_id && !req.body.users_id) {
      const transaction = await Payment.findOneAndUpdate(
        { _id, "users.user_id": req.body.user_id },
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
    } else if (req.body.users_id && !req.body.user_id) {
      const usersId = [
        req.body.users_id.map((userId) => {
          return { user_id: userId };
        }),
      ];
      const transaction = await Payment.findOneAndUpdate(
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
  } catch (err) {
    next(err);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const _id = req.params.id;
    if (!isValidObjectId(_id)) {
      return res.json({
        message: "Error",
        data: "Invalid identifier",
      });
    }
    const transaction = await Payment.findOneAndRemove(
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
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  registerUser,
  updateUser,
  deleteUser,
  getUsers,
  getPayments,
  getPayment,
  addPayment,
  verifyUserPayment,
  deletePayment,
};
