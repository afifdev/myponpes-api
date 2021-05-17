const { Schema, model } = require("mongoose");

const Planner = new Schema({
  type: String,
  priority: String,
  name: String,
  value: String,
});

module.exports = model("Planner", Planner);
