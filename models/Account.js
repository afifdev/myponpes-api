const { Schema, model } = require("mongoose");

const Account = new Schema({
  balance: String,
  transaction: [
    {
      title: String,
      desc: String,
      amount: String,
      due_date: String,
      ref_code: String,
      users: [
        {
          user_id: String,
          payment_date: String,
          image: String,
          is_complete: Boolean,
        },
      ],
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
