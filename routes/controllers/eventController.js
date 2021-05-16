const Event = require("../../models/Event");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { isValidObjectId } = require("mongoose");
dotenv.config();

const getEvents = async (req, res, next) => {
  const events = await Event.find();
  if (events) {
    return res.json({
      message: "Success",
      data: events,
    });
  }
  res.json({
    message: "Error",
    data: "Post not found error",
  });
};

const getEvent = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId) {
    return res.json({
      message: "Error",
      data: "Cannot identify",
    });
  }
  const event = await Event.findOne({ _id });
  if (event) {
    return res.json({
      message: "Success",
      data: event,
    });
  }
  res.json({
    message: "Error",
    data: "Post not found",
  });
};

const postEvent = async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.category ||
    !req.body.desc ||
    !req.body.date ||
    req.files.length === 0
  ) {
    return res.json({
      message: "Error",
      data: "Please fill entire fields",
    });
  }
  const { title, category, desc, date } = req.body;
  const images = [];
  req.files.map((image) => {
    images.push(image.path);
  });

  const event = new Event({
    title,
    category,
    desc,
    date,
    images,
  });

  const saveEvent = await event.save();
  if (saveEvent) {
    res.json({
      message: "Success",
      data: saveEvent,
    });
  } else {
    res.json({
      message: "Error",
      data: "Failed to post",
    });
  }
};

const updateEvent = async (req, res, next) => {
  if (!isValidObjectId) {
    return res.json({
      message: "Error",
      data: "Cannot identify",
    });
  }

  if (!req.body) {
    return res.json({
      message: "Error",
      data: "Fill the body fields",
    });
  }

  const _id = req.params.id;
  const images = [];

  if (req.files.length > 0) {
    const event = await Event.findOne({ _id }, "images");

    if (!event) {
      req.files.map((image) => {
        fs.unlinkSync(path.join(__dirname, `../../${image.path}`));
      });
      return res.json({
        message: "Error",
        data: "Event not found",
      });
    }

    req.files.map((image) => {
      images.push(image.path);
    });
    event.images.map((image) => {
      fs.unlinkSync(path.join(__dirname, `../../${image}`));
    });
  }

  const event = await Event.findOneAndUpdate(
    { _id },
    { $set: { ...req.body, images } },
    { useFindAndModify: false }
  );
  if (event) {
    return res.json({
      message: "Success",
      data: event,
    });
  }
  return res.json({
    message: "Error",
    data: "Error",
  });
};

const deleteEvent = async (req, res, next) => {
  const _id = req.params.id;
  if (!isValidObjectId) {
    return res.json({
      message: "Error",
      data: "Cannot identify",
    });
  }
  const removedEvent = await Event.findOneAndRemove(
    { _id },
    { useFindAndModify: false }
  );
  if (removedEvent) {
    removedEvent.images.map((image) => {
      fs.unlinkSync(path.join(__dirname, `../../${image}`));
    });
    res.json({
      message: "Success",
      data: removedEvent,
    });
  } else {
    res.json({
      message: "Error",
      data: "Cannot delete post",
    });
  }
};

module.exports = { postEvent, getEvent, getEvents, updateEvent, deleteEvent };
