const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  todo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Todo = mongoose.model("col2", todoSchema);
module.exports = Todo;
