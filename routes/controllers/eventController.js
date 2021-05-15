const Event = require("../../models/Event");
const dotenv = require("dotenv");
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

const postEvent = (req, res, next) => {
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

  event
    .save()
    .then((r) => {
      res.json({
        message: "Success",
        data: r,
      });
    })
    .catch((e) => {
      res.json({
        message: "Error",
        data: "Failed to post",
      });
    });
};

const updateEvent = (req, res, next) => {
  const _id = req.params.id;
  const data = {};
  if (req.files.length > 0) {
    const paths = [];
    req.files.map((image) => {
      paths.push(image.path);
    });
    // Delete previous image
    data.field = { ...req.body, image: paths };
  } else {
    data.field = { ...req.body };
  }
  Event.findByIdAndUpdate(_id, { ...data.field }, { useFindAndModify: false })
    .then((event) => {
      res.json({
        message: "Success",
        data: event,
      });
    })
    .catch((err) => {
      res.json({
        message: "Error",
        data: "Cannot post for some reason",
      });
    });
};

const deleteEvent = (req, res, next) => {
  const _id = req.params.id;
  Event.findOneAndRemove({ _id }, { useFindAndModify: false })
    .then((r) => {
      res.json({
        message: "Success",
        data: r,
      });
    })
    .catch((e) => {
      res.json({
        message: "Error",
        data: "Cannot delete post",
      });
    });
};

module.exports = { postEvent, getEvent, getEvents, updateEvent, deleteEvent };
