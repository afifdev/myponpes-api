const multer = require("multer");
const { fileFilter, fileStorage } = require("../../config/file");
const routes = require("./event");
const userControllers = require("../controllers/userController");
const auth = require("../../utils/auth");
const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("image");

// http://localhost:4000/api/user

// [GET]
routes.get("/", upload, auth, userControllers.getUsers);

// [GET]
routes.get("/:id", upload, auth, userControllers.getUser);

// [PUT]
routes.put("/:id", upload, auth, userControllers.updateUser);

// [DELETE]
routes.delete("/:id", upload, auth, userControllers.deleteUser);

// [POST]
routes.post("/register", upload, auth, userControllers.register);

// [POST]
routes.post("/login", upload, userControllers.login);

module.exports = routes;
