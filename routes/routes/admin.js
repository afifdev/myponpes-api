const express = require("express");
const routes = express.Router();
const multer = require("multer");
const { fileFilter, fileStorage } = require("../../config/file");
const adminControllers = require("../controllers/adminController");
const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");

// http://localhost:4000/api/admin

// [POST]
routes.post("/", upload, adminControllers.login);

module.exports = routes;
