const express = require("express");
const routes = express.Router();
const multer = require("multer");
const {
  fileFilter,
  fileStorage,
  multifileStorage,
} = require("../../config/file");
const auth = require("../../utils/auth");
const upload = multer({
  fileFilter: fileFilter,
  storage: fileStorage,
}).single("image");
const uploads = multer({
  fileFilter,
  storage: multifileStorage,
}).array("images");
const userControllers = require("../controllers/userController");

// http://localhost:4000/api/user

// [POST]
routes.post("/login", upload, userControllers.loginUser);

// [GET]
routes.get("/", auth, userControllers.getUser);

// [PUT]
routes.put("/", upload, auth, userControllers.updateUser);

// LEVELING --------------------------

// [PUT]
// routes.put("/manage/:id", uploads, auth, userControllers.manageUpdateUser);

module.exports = routes;
