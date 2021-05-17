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

routes.post("/login", formHandler, userControllers.loginUser);
routes.get("/", auth, checkUser, userControllers.getUser);
routes.put("/", userUpload, auth, checkUser, userControllers.updateUser);
routes.get("/transaction", auth, checkUser, userControllers.getMyTransaction);
routes.put(
  "/transaction/:id",
  transactionUpload,
  auth,
  checkUser,
  userControllers.updateMyTransaction
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
