const { Schema, model } = require("mongoose");

const User = new Schema({
  username: String,
  password: String,
  email: String,
  name: String,
  born_date: String,
  born_place: String,
  gender: Boolean,
  address: String,
  phone_number: String,
  parent_name: String,
  parent_phone_number: String,
  image: String,
  date_in: String,
  date_out: String,
  active_until: String,
  level: Number,
  payment: [
    {
      title: String,
      desc: String,
      amount: String,
      sent_amount: String,
      due_date: String,
      ref_code: String,
      image: String,
      is_complete: Boolean,
    },
  ],
  progress: {
    hafalan: [
      {
        creator_id: String,
        date: String,
        juz: String,
        surat: String,
        ayat: String,
      },
    ],
    kitab: [
      {
        creator_id: String,
        name: String,
        max_page: Number,
        date: String,
        current_page: Number,
      },
    ],
    attendance: {
      jamaah: [
        {
          creator_id: String,
          kind: String,
          date: String,
          is_attend: Boolean,
        },
      ],
      ngaji: [
        {
          creator_id: String,
          kind: String,
          date: String,
          is_attend: Boolean,
        },
      ],
    },
    achievement: [
      {
        creator_id: String,
        title: String,
        event: String,
        image: String,
      },
    ],
    returning: [
      {
        creator_id: String,
        kind: String,
        date: String,
        return_due_date: String,
        return_date: String,
        is_return: Boolean,
      },
    ],
  },
});

module.exports = model("User", User);
