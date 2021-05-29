const express = require("express");
const routes = express.Router();
const userControllers = require("../controllers/userController");
const auth = require("../../utils/auth");
const checkUserLevel = require("../../utils/checkUserLevel");
const checkUser = require("../../utils/checkUser");
const multer = require("multer");
const formHandler = multer().none();
const {
  fileFilter,
  userStorage,
  achievementStorage,
  transactionStorage,
} = require("../../config/file");
const userUpload = multer({
  fileFilter: fileFilter,
  storage: userStorage,
}).single("image");
const transactionUpload = multer({
  fileFilter: fileFilter,
  storage: transactionStorage,
}).single("image");
const achievementUpload = multer({
  fileFilter: fileFilter,
  storage: achievementStorage,
}).single("image");

// http://localhost:4000/api/user

// Login
routes.post("/", formHandler, userControllers.loginUser);
// Get Me (What do you need)
routes.get("/", auth, checkUser, userControllers.getUser);
// Update Me
routes.put("/", userUpload, auth, checkUser, userControllers.updateUser);

// TRANSACTION ----------------------

// Get My Transaction
routes.get("/transaction", auth, checkUser, userControllers.getMyPayment);
// Get My Detailed Transaction
routes.put(
  "/transaction/:id",
  transactionUpload,
  auth,
  checkUser,
  userControllers.updateMyPayment
);

// LEVELING --------------------------

routes.get(
  "/withlevel",
  auth,
  checkUserLevel,
  userControllers.withLevelGetUsers
);
routes.post(
  "/withlevel/hafalan/:id",
  formHandler,
  auth,
  checkUserLevel,
  userControllers.withLevelAddHafalan
);
routes.post(
  "/withlevel/kitab/:id",
  formHandler,
  auth,
  checkUserLevel,
  userControllers.withLevelAddKitab
);
routes.post(
  "/withlevel/achievement/:id",
  achievementUpload,
  auth,
  checkUserLevel,
  userControllers.withLevelAddAchievement
);
routes.post(
  "/withlevel/returning/:id",
  formHandler,
  auth,
  checkUserLevel,
  userControllers.withLevelAddReturning
);
routes.put(
  "/withlevel/returning/:id",
  formHandler,
  auth,
  checkUserLevel,
  userControllers.withLevelUpdateReturning
);
routes.post(
  "/withlevel/jamaah/:id",
  formHandler,
  auth,
  checkUserLevel,
  userControllers.withLevelAddJamaah
);
routes.post(
  "/withlevel/ngaji/:id",
  formHandler,
  auth,
  checkUserLevel,
  userControllers.withLevelAddNgaji
);

module.exports = routes;
