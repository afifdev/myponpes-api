const express = require("express");
const routes = express.Router();
const multer = require("multer");
const { fileFilter, multifileStorage } = require("../../config/file");
const eventControllers = require("../controllers/eventController");
const uploads = multer({
  storage: multifileStorage,
  fileFilter: fileFilter,
}).array("images");

// http://localhost:4000/api/event

routes.get("/", eventControllers.getEvents);
routes.get("/:id", eventControllers.getEvent);
routes.post("/", uploads, eventControllers.postEvent);
routes.put("/:id", uploads, eventControllers.updateEvent);
routes.delete("/:id", eventControllers.deleteEvent);

module.exports = routes;
