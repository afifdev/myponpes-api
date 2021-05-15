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

// [GET]
routes.get("/", eventControllers.getEvents);

// [GET]
routes.get("/:id", eventControllers.getEvent);

// [POST]
routes.post("/", uploads, eventControllers.postEvent);

// [PUT]
routes.put("/:id", uploads, eventControllers.updateEvent);

// [DELETE]
routes.delete("/:id", eventControllers.deleteEvent);

module.exports = routes;
