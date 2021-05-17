const express = require("express");
const routes = express.Router();
const multer = require("multer");
const auth = require("../../utils/auth");
const { fileFilter, fileStorage } = require("../../config/file");
const adminControllers = require("../controllers/adminController");
const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");
const formHandler = multer().none();

// http://localhost:4000/api/admin

routes.post("/", formHandler, adminControllers.login);

// ----------------------- USER

routes.get("/user", formHandler, auth, adminControllers.getUsers);
routes.post("/user", upload, auth, adminControllers.registerUser);
routes.put("/user/:id", upload, auth, adminControllers.updateUser);
routes.delete("/user/:id", formHandler, auth, adminControllers.deleteUser);

// ------------------------ TRANSACTION

routes.get("/transaction", auth, adminControllers.getTransactions);
routes.get("/transaction/:id", auth, adminControllers.getTransaction);
routes.post("/transaction", upload, auth, adminControllers.addTransaction);
routes.delete("/transaction/:id", auth, adminControllers.deleteTransaction);

module.exports = routes;
