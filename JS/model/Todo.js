const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  /* 사용자 입력을 받아서 서버로 데이터 보낼때 userId는 생성할수 없다.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
*/
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
const Todo = mongoose.model("col2", todoSchema); // 'col2' 컬렉션을 지정
module.exports = Todo;
