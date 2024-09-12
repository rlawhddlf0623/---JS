const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  Rate: [
    {
      type: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rate = mongoose.model("completionRate", userSchema);
module.exports = Rate;
