const { Schema, model } = require("mongoose");

const Account = new Schema({
  balance: String,
  transaction: [
    {
      type: String,
      name: String,
      value: String,
      ref_code: String,
    },
  ],
  planner: [
    {
      type: String,
      priority: String,
      name: String,
      value: String,
    },
  ],
});

module.exports = model("Account", Account);
