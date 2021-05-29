const { Schema, model } = require("mongoose");

const Payment = new Schema({
  title: String,
  desc: String,
  amount: String,
  due_date: String,
  ref_code: String,
  category: Boolean, // SPP, Other
  is_complete: Boolean,
  users: [
    {
      user_id: String,
      payment_date: String,
      image: String,
      is_complete: Boolean,
    },
  ],
});

module.exports = model("Payment", Payment);
