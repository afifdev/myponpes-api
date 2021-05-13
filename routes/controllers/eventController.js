const Event = require("../../models/Event");
const dotenv = require("dotenv");
dotenv.config();

const postEvent = (req, res, next) => {
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
      const err = new Error();
      err.message = "Error Occured";
      err.data = "Please post again";
      throw err;
    });
};

const getEvents = async (req, res, next) => {
  const events = await Event.find();
  if (events) {
    res.json({
      message: "Success",
      data: events,
    });
  }
  res.json({
    message: "Failed",
    data: "Post not found error",
  });
};

const getEvent = async (req, res, next) => {
  const _id = req.params.id;
  const event = await Event.findOne({ _id });
  if (event) {
    res.json({
      message: "Success",
      data: event,
    });
  }
  res.json({
    message: "Failed",
    data: "Post not found",
  });
};

const updateEvent = (req, res, next) => {
  const _id = req.params.id;
  if (req.files) {
    const paths = [];
    req.files.map((image) => {
      paths.push(image.path);
    });
    removeImages(paths);
  }
  next();
  //   Event.findOneAndUpdate({ _id }, { ...req.body }, { useFindAndModify: false })
  //     .then((r) => {
  //       res.json({
  //         message: "Success",
  //         data: r,
  //       });
  //     })
  //     .catch((e) => {
  //       const err = new Error();
  //       err.message = "Error Occured!";
  //       err.data = "Please do it again";
  //       throw err;
  //     });
};

const deleteEvent = (req, res, next) => {
  const _id = req.params.id;
  Event.findOneAndRemove({ _id })
    .then((r) => {
      res.json({
        message: "Success",
        data: r,
      });
    })
    .catch((e) => {
      const err = new Error();
      err.message = "Error Occured";
      err.data = "Post not found or crash";
    });
};

const removeImages = (filePath) => {
  console.log(filePath);
};

module.exports = { postEvent, getEvent, getEvents, updateEvent, deleteEvent };
