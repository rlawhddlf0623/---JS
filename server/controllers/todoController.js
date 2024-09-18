const mongoose = require("../config/mongo");
const User = require("../server/routes/models/User");
// const Todo = require("./model/Todo");
const Rate = require("../server/routes/models/Rate");
const auth = require("../middlewares/auth");
const {
  setAccessToken,
  getAccessToken,
} = require("../server/routes/models/tokenManager");

const express = require("express");
const app = express();
// Body-parser middleware 설정
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const todoUserSchema = new mongoose.Schema({
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
// 개발시 임시로 collection 고정
let TodoModel = mongoose.model("user3", todoUserSchema);

function TodayDate() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  // console.log("TodayDate", startOfDay, endOfDay);
  return [startOfDay, endOfDay];
}

//todo 저장
exports.register = async (req, res) => {
  try {
    const { AccessTokenSave, newTodoObj } = req.body;
    // console.log("newTodoObj", newTodoObj);
    // console.log("AccessTokenSave : ", AccessTokenSave);

    let AccessToken = await auth.authenticateToken(req, res, AccessTokenSave);
    if (!AccessToken) {
      console.error("인증되지 않은 사용자입니다.");
      res.status(200).json({ AccessToken });
      return;
    }

    if (!newTodoObj.id || !newTodoObj.todo) {
      return res.status(400).json({ error: "ID and todo are required" });
    }

    // console.log("validCollectionName(todo저장)", validCollectionName);
    // const TodoModel = CreateCollection(validCollectionName);

    const newTodo = new TodoModel({
      id: newTodoObj.id,
      todo: newTodoObj.todo,
    });
    await newTodo.save();

    console.log("newTodo :  ", newTodo);

    let [startOfDay, endOfDay] = TodayDate();
    // 오늘의 todos를 조회
    const count = await TodoModel.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({ newTodo, count, AccessToken });
  } catch (err) {
    console.log("err:", err);
    res.status(500).send("Error registering user");
  }
};

//todo 삭제
exports.registerTodoId = async (req, res) => {
  const { todoId, AccessTokenSave } = req.body;

  // Access token 인증
  let AccessToken = await auth.authenticateToken(req, res, AccessTokenSave);

  if (!AccessToken) {
    console.error("인증되지 않은 사용자입니다.");
    const count = null;
    res.status(200).json({ count, AccessToken });
    return;
  }
  try {
    // const TodoModel = CreateCollection(validCollectionName);
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
    console.log("deletedTodo", deletedTodo);

    let [startOfDay, endOfDay] = TodayDate();
    if (deletedTodo) {
      const count = await TodoModel.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
      });
      // console.log("count", count);
      // console.log("새로 발급한 AccessToken", AccessToken);

      res.status(200).json({ count, AccessToken });
    } else {
      res.status(404).json({ error: "Todo not found." });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo." });
  }
};

exports.Update = async (req, res) => {
  const { todoId, update, AccessTokenSave } = req.body;
  if (!todoId || !update) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }
  // Access token 인증
  let newAccessToken = await auth.authenticateToken(req, res, AccessTokenSave);
  console.log("Update의 newAccessToken", newAccessToken);

  if (!newAccessToken) {
    console.error("인증되지 않은 사용자입니다.");
    const token = null;
    res.status(200).json(token);
    return;
  }

  console.log("todoId ,update", todoId, update);
  try {
    // const TodoModel = CreateCollection(validCollectionName);
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      todoId,
      { todo: update },
      { new: true, runValidators: true }
    );
    // console.log(updatedTodo);
    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    res.json(newAccessToken);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

exports.completionRateSaveDB = async (req, res) => {
  const { weeksArray, AccessTokenSave } = req.body;
  // console.log(weeksArray, AccessTokenSave);
  let newAccessToken = await auth.authenticateToken(req, res, AccessTokenSave);

  if (!Array.isArray(weeksArray)) {
    throw new Error("Rate must be an array of strings");
  }
  // console.log("weeksArray", weeksArray);
  if (!weeksArray) {
    return res.status(400).json({ error: "weeksArray are required" });
  }
  let currentDate = "24년9월";
  try {
    const updatedTodo1 = await Rate.findOne({ id: currentDate });
    // console.log(updatedTodo1);

    if (!updatedTodo1) {
      const completionRate = await new Rate({
        id: currentDate,
        Rate: weeksArray,
      });
      // console.log("new", completionRate);
      await completionRate.save();
      res.status(200).json({ completionRate, newAccessToken });
    } else {
      const completionRate = await Rate.findOneAndUpdate(
        { id: currentDate },
        { Rate: weeksArray },
        { new: true, runValidators: true }
      );
      // console.log("update", completionRate);
      res.status(200).json({ completionRate, newAccessToken });
    }

    // const TodoModel = CreateCollection(validCollectionName);
    // const completionRate = new Rate({
    //   id: "24년8월",
    //   Rate: weeksArray,
    // });

    // await completionRate.save();

    // res.status(200).json({ completionRate });
  } catch (err) {
    res.status(500).send("Error completionRateSaveDB");
    console.log("err:", err);
  }
};

// Read (현재 todo수 반환)
exports.getCurrentTodo = async (req, res) => {
  try {
    let [start, end] = TodayDate();
    // const TodoModel = CreateCollection(validCollectionName);
    const count = await TodoModel.countDocuments({
      date: { $gte: start, $lte: end },
    });

    res.status(200).json(count);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error counting documents");
  }
};

exports.showTodo = async (req, res) => {
  try {
    const calendarClickValue = req.body.clickDate;
    console.log("클릭한 날짜  : ", calendarClickValue);
    // 입력 받은 날짜를 자바스크립트 Date 객체로 변환
    const inputDate = new Date(calendarClickValue);
    console.log("calendarClickValue  : ", calendarClickValue);
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0)); // 00:00:00
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999)); // 23:59:59
    // console.log("startOfDay, endOfDay", startOfDay, endOfDay);

    const todos = await TodoModel.find({
      date: {
        $gte: startOfDay, // 해당 날짜의 시작 시간
        $lte: endOfDay, // 해당 날짜의 끝 시간
      },
    });
    console.log("todos : ", todos);
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error counting documents");
  }
};

exports.getDoneTodo = async (req, res) => {
  try {
    // const TodoModel = CreateCollection(validCollectionName);

    let [start, end] = TodayDate();
    const count = await TodoModel.countDocuments({
      status: "completed",
      date: { $gte: start, $lte: end },
    });
    res.status(200).json({ completedCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error counting completed todos");
  }
};

// status 'completed'로 업데이트하는 엔드포인트
exports.updateStatusCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const AccessTokenSave = req.body.AccessTokenSave;
    let newAccessToken = await auth.authenticateToken(
      req,
      res,
      AccessTokenSave
    );

    // console.log("Received ID1:", id);
    if (!id) {
      return res.status(400).send("ID is required");
    }

    // console.log("Received ID2:", id);
    // const TodoModel = CreateCollection(validCollectionName);
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: id },
      { status: "completed" },
      { new: true }
    );
    // console.log("Received ID3:", id);
    // console.log("updatedTodo", updatedTodo);
    if (updatedTodo) {
      res.status(200).json({ updatedTodo, newAccessToken });
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).send("Error updating status");
  }
};
// status 'Pending'로 업데이트하는 엔드포인트
exports.updateStatusPending = async (req, res) => {
  try {
    const { id } = req.params;
    // const TodoModel = CreateCollection(validCollectionName);
    const AccessTokenSave = req.body.AccessTokenSave;
    let newAccessToken = await auth.authenticateToken(
      req,
      res,
      AccessTokenSave
    );

    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: id },
      { status: "pending" },
      { new: true }
    );

    if (updatedTodo) {
      res.status(200).json({ updatedTodo, newAccessToken });
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating status");
  }
};
// 어제 못한 todo 오늘로 이동
exports.StatusPendingYesterday = async (req, res) => {
  // 하루 전 날짜 계산
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const startOfDay = new Date(oneDayAgo);
  startOfDay.setHours(0, 0, 0, 0); // 어제의 시작 시간

  const endOfDay = new Date(oneDayAgo);
  endOfDay.setHours(23, 59, 59, 999); // 어제의 끝 시간

  // 현재 날짜와 시간
  const currentDate = new Date();
  console.log("currentDate", currentDate);
  try {
    const AccessTokenSave = req.body.AccessTokenSave;
    console.log("StatusPendingYesterday의 AccessTokenSave : ", AccessTokenSave);
    let newAccessToken = await auth.authenticateToken(
      req,
      res,
      AccessTokenSave
    );

    const result = await TodoModel.updateMany(
      {
        status: "pending",
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      {
        $set: { date: currentDate },
      }
    );
    console.log("result", result);

    if (result) {
      console.log(`어제의 todo 이동완료`);
      res.status(200).json({ newAccessToken });
    } else {
      res.status(404).send("어제 완료하지 못한 todo가 없습니다.");
      console.log("어제 완료하지 못한 todo가 없습니다.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating status");
  }
};

// Access token 보내기
exports.AccessToken = async (req, res) => {
  try {
    let AccessTokenSave = getAccessToken();
    console.log("getAccessToken()", getAccessToken());
    console.log("AccessToken ", AccessTokenSave);

    res.status(200).json(AccessTokenSave);
  } catch (err) {
    res.status(500).send("Error AccessTokenSave");
    console.log("err:", err);
  }
};

// localStorage와 DB동기화
exports.syncData = async (req, res) => {
  try {
    // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
    let [startOfDay, endOfDay] = TodayDate();
    // const TodoModel = CreateCollection(validCollectionName);

    // console.log(startOfDay, endOfDay);
    const todos = await TodoModel.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    console.log("syncData의todos : ", todos);

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
