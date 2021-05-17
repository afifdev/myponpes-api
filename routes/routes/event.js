const express = require("express");
const routes = express.Router();
const eventControllers = require("../controllers/eventController");
const auth = require("../../utils/auth");
const checkUserLevel = require("../../utils/checkUserLevel");
const multer = require("multer");
const { fileFilter, eventStorage } = require("../../config/file");
const eventUpload = multer({
  fileFilter: fileFilter,
  storage: eventStorage,
}).array("images");

// http://localhost:4000/api/event

routes.get("/", auth, eventControllers.getEvents);
routes.get("/:id", auth, eventControllers.getEvent);
routes.post("/", eventUpload, auth, checkUserLevel, eventControllers.postEvent);
routes.put(
  "/:id",
  eventUpload,
  auth,
  checkUserLevel,
  eventControllers.updateEvent
);
routes.delete("/:id", auth, checkUserLevel, eventControllers.deleteEvent);

module.exports = routes;
