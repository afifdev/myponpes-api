const { Schema, model } = require("mongoose");

const Transaction = new Schema({
  is_debit: Boolean,
  date: String,
  amount: String,
});

module.exports = model("Transaction", Transaction);
