const Event = require("../../models/Event");
const fs = require("fs");
const path = require("path");
const { isValidObjectId } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const getEvents = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const getEvent = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const postEvent = async (req, res, next) => {
  try {
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
    if (!saveEvent) {
      images.map((image) => {
        fs.unlinkSync(path.join(__dirname, image));
      });
      return res.json({
        message: "Error",
        data: "Failed to post",
      });
    }
    return res.json({
      message: "Success",
      data: saveEvent,
    });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const _id = req.params.id;
    if (!isValidObjectId(_id)) {
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
    if (req.body._id) {
      delete req.body._id;
    }
    const event = await Event.findOneAndUpdate(
      { _id },
      { $set: { ...req.body } },
      { useFindAndModify: false }
    );
    if (!event) {
      return res.json({
        message: "Error",
        data: "Error",
      });
    }
    return res.json({
      message: "Success",
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
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
    if (!removedEvent) {
      return res.json({
        message: "Error",
        data: "Cannot delete post",
      });
    }
    removedEvent.images.map((image) => {
      fs.unlinkSync(path.join(__dirname, `../../${image}`));
    });
    return res.json({
      message: "Success",
      data: removedEvent,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { postEvent, getEvent, getEvents, updateEvent, deleteEvent };
