const express = require("express");
const routes = express.Router();
const adminControllers = require("../controllers/adminController");
const auth = require("../../utils/auth");
const checkAdmin = require("../../utils/checkAdmin");
const multer = require("multer");
const formHandler = multer().none();
const { fileFilter, userStorage } = require("../../config/file");
const userUpload = multer({
  storage: userStorage,
  fileFilter: fileFilter,
}).single("image");

// http://localhost:4000/api/admin

routes.post("/", formHandler, adminControllers.login);

// ----------------------- USER

routes.get("/user", auth, checkAdmin, adminControllers.getUsers);
routes.post(
  "/user",
  userUpload,
  auth,
  checkAdmin,
  adminControllers.registerUser
);
routes.put(
  "/user/:id",
  userUpload,
  auth,
  checkAdmin,
  adminControllers.updateUser
);
routes.delete(
  "/user/:id",
  formHandler,
  auth,
  checkAdmin,
  adminControllers.deleteUser
);

// ------------------------ TRANSACTION

routes.get("/transaction", auth, checkAdmin, adminControllers.getPayments);
routes.get("/transaction/:id", auth, checkAdmin, adminControllers.getPayment);
routes.post(
  "/transaction",
  formHandler,
  auth,
  checkAdmin,
  adminControllers.addPayment
);
routes.put(
  "/transaction/:id",
  formHandler,
  auth,
  checkAdmin,
  adminControllers.verifyUserPayment
);
routes.delete(
  "/transaction/:id",
  auth,
  checkAdmin,
  adminControllers.deletePayment
);

module.exports = routes;
