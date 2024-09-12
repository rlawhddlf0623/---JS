const mongoose = require("../config/mongo");
const User = require("../models/User");
// const Todo = require("./model/Todo");
const Rate = require("../models/Rate");
const auth = require("../middlewares/auth");
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
    const { id, todo, AccessTokenSave } = req.body;
    // console.log("req.body", req.body);
    // const AccessTokenSave = req.body.AccessTokenSave;
    // console.log("AccessTokenSave : ", AccessTokenSave);

    let AccessToken = await auth.authenticateToken(req, res, AccessTokenSave);

    // if (!authenticate_Token) {
    //   // authenticateToken안에서 응답을 보내고 있어 중복된 응답을 보내서 에러가 발생한다.
    //   console.log("Refresh token 인증 에러");
    //   return res.status(400).json({ error: "Access token Error" });
    // }

    // const { id, todo } = req.body;
    if (!id || !todo) {
      return res.status(400).json({ error: "ID and todo are required" });
    }

    // console.log("validCollectionName(todo저장)", validCollectionName);
    // const TodoModel = CreateCollection(validCollectionName);

    const newTodo = new TodoModel({
      id,
      todo,
    });
    await newTodo.save();

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
//   app.delete("/register/:todoId",
exports.registerTodoId = async (req, res) => {
  const { todoId, AccessTokenSave } = req.body;

  // Access token 인증
  let AccessToken = await auth.authenticateToken(req, res, AccessTokenSave);

  try {
    // const TodoModel = CreateCollection(validCollectionName);
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
    // console.log("deletedTodo", deletedTodo);

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

//Update app.put("/Update
exports.Update = async (req, res) => {
  const { todoId, update, AccessTokenSave } = req.body;

  // Access token 인증
  let newAccessToken = await auth.authenticateToken(req, res, AccessTokenSave);
  console.log("Update의 newAccessToken", newAccessToken);
  if (!todoId || !update) {
    return res.status(400).json({ success: false, message: "Invalid data" });
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

    res.json({ newAccessToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

//  app.post("/completionRateSaveDB",
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

// Read (현재 todo수 반환) : app.post("/getCurrentTodo"
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
//   app.post("/showTodo",

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
//   app.post("/getDoneTodo",
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

// status 'completed'로 업데이트하는 엔드포인트 :app.put("/updateStatusCompleted/:id",
exports.updateStatusCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const AccessTokenSave = req.AccessTokenSave;
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
// status 'Pending'로 업데이트하는 엔드포인트 :app.put("/updateStatusPending/:id",
exports.updateStatusPending = async (req, res) => {
  try {
    const { id } = req.params;
    // const TodoModel = CreateCollection(validCollectionName);
    const AccessTokenSave = req.AccessTokenSave;
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
//   app.put("/StatusPendingYesterday/",
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
    const AccessTokenSave = req.AccessTokenSave;
    let newAccessToken = await auth.authenticateToken(
      req,
      res,
      AccessTokenSave
    );

    const result = await TodoModel.updateMany(
      {
        status: "pending", // 상태가 "pending"인 항목
        date: {
          $gte: startOfDay, // 해당 날짜의 시작 시간
          $lte: endOfDay, // 해당 날짜의 끝 시간
        },
      },
      {
        $set: { date: currentDate }, // date를 현재 날짜로 업데이트
      }
    );

    const yesterdayTodo = await TodoModel.find({
      status: "pending", // 상태가 "pending"인 항목
      date: {
        $gte: startOfDay, // 해당 날짜의 시작 시간
        $lte: endOfDay, // 해당 날짜의 끝 시간
      },
    });
    console.log("yesterdayTodo", yesterdayTodo);

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

// localStorage와 DB동기화 : app.get("/syncData",
exports.syncData = async (req, res) => {
  try {
    // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
    let [startOfDay, endOfDay] = TodayDate();
    // const TodoModel = CreateCollection(validCollectionName);
    // 현재 날짜의 todos를 조회
    // console.log(startOfDay, endOfDay);
    const todos = await TodoModel.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // 클라이언트에 데이터 전송
    // console.log("현재 날짜의 todos", todos);
    res.status(200).json(todos);
    // res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
