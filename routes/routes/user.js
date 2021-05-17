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
const formHandler = multer().none();
const userControllers = require("../controllers/userController");

// http://localhost:4000/api/user

routes.post("/login", formHandler, userControllers.loginUser);
routes.get("/", auth, userControllers.getUser);
routes.put("/", upload, auth, userControllers.updateUser);

// LEVELING --------------------------

module.exports = routes;
