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

// http://localhost:4000/api/admin

// [POST]
routes.post("/", upload, adminControllers.login);

// [GET]
routes.get("/user", upload, auth, adminControllers.getUsers);

// [POST]
routes.post("/user", upload, auth, adminControllers.registerUser);

// [PUT]
routes.put("/user/:id", upload, auth, adminControllers.updateUser);

// [DELETE]
routes.delete("/user/:id", upload, auth, adminControllers.deleteUser);

module.exports = routes;
