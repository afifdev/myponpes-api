const express = require("express");
const routes = express.Router();
const multer = require("multer");
const { fileFilter, multifileStorage } = require("../../config/file");
const eventControllers = require("../controllers/eventController");
const uploads = multer({
  storage: multifileStorage,
  fileFilter: fileFilter,
}).array("images");

// [POST]
// http://localhost:4000/api/event
routes.post("/", uploads, eventControllers.postEvent);

// [GET]
// http://localhost:4000/api/event
routes.get("/", eventControllers.getEvents);

// [GET]
// http://localhost:4000/api/event/:id
routes.get("/:id", eventControllers.getEvent);

// [PUT]
// http://localhost:4000/api/event/:id
routes.put("/:id", uploads, eventControllers.updateEvent);

// [DELETE]
// http://localhost:4000/api/event/:id
routes.delete("/:id", uploads, eventControllers.deleteEvent);

module.exports = routes;
