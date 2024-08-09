const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/User");
const Todo = require("./model/Todo");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const port = 3000;
const router = express.Router();

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Body-parser middleware 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB 연결 설정
mongoose.connect("mongodb://127.0.0.1:27017/dbfirst", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoDB 연결
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// 'public' 디렉토리 안의 파일들을 정적 파일로 제공 (path.join으로 절대경로 제공)
// public디렉토리의 정적파일 제공
app.use(express.static(path.join(__dirname, "public")));

// 사용자 입력 폼 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 사용자 도큐먼트 개수 세기
// const count = await Todo.countDocuments({});
// console.log(`Number of documents: ${count}`);

//todo 저장
app.post("/register", async (req, res) => {
  try {
    const { id, todo } = req.body;

    const newTodo = new Todo({
      id,
      todo,
    });
    await newTodo.save();
    // 사용자 문서에 새로운 ToDo 항목 추가
    /*
    await User.findByIdAndUpdate(userId, {
      $push: { todos: savedTodo._id },
    });
  */
    const count = await Todo.countDocuments({});
    res.status(200).json({ newTodo, count });
  } catch (err) {
    res.status(500).send("Error registering user");
    console.log("err:", err);
  }
});

//todo 삭제
app.delete("/register/:todoId", async (req, res) => {
  const { todoId } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (deletedTodo) {
      const count = await Todo.countDocuments({});
      res.status(200).json(count);
    } else {
      res.status(404).json({ error: "Todo not found." });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo." });
  }
});

//Update
app.put("/Update", async (req, res) => {
  const { todoId, update } = req.body;

  if (!todoId || !update) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }
  console.log("todoId ,update", todoId, update);
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { todo: update },
      { new: true, runValidators: true }
    );
    console.log(updatedTodo);
    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    res.json({
      success: true,
      message: "Todo updated successfully!",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// localStorage와 DB동기화
app.get("/syncData", async (req, res) => {
  try {
    // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // 현재 날짜의 todos를 조회
    const todos = await Todo.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // 클라이언트에 데이터 전송
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Read (현재 todo수 반환)
app.get("/getCurrentTodo", async (req, res) => {
  try {
    // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const count = await Todo.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    res.status(200).json(count);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error counting documents");
  }
});

app.get("/getDoneTodo", async (req, res) => {
  try {
    // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const count = await Todo.countDocuments({
      status: "completed",
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    res.status(200).json({ completedCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error counting completed todos");
  }
});
// status 'completed'로 업데이트하는 엔드포인트
app.put("/updateStatusCompleted/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Received ID1:", id);
    if (!id) {
      return res.status(400).send("ID is required");
    }

    console.log("Received ID2:", id);
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id },
      { status: "completed" },
      { new: true }
    );
    console.log("Received ID3:", id);
    console.log("updatedTodo", updatedTodo);
    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).send("Error updating status");
  }
});
// status 'Pending'로 업데이트하는 엔드포인트
app.put("/updateStatusPending/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id },
      { status: "pending" },
      { new: true }
    );

    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating status");
  }
});

// 회원정보 저장 + 사용자id로 todo collection만들기
app.post("/UserCollection", async (req, res) => {
  const { id, pw, email, name } = req.body;

  if (!id || !pw || !email || !name) {
    return res
      .status(400)
      .json({ error: "Collection name and todo are required" });
  }

  try {
    // 사용자 입력 이메일과 동일한 이메일을 가진 문서를 찾습니다.
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log("이메일이 이미 존재합니다.");
      return res.status(400).json({ error: "Email already exists" });
    } else {
      console.log("사용할 수 있는 이메일입니다.");
      //users에 저장
      const newUser = new User({ id, pw, email, name });
      await newUser.save();

      const validCollectionName = id.replace(/[^a-zA-Z0-9]/g, "");
      // 사용자id로 collection만들기

      const TodoModel = mongoose.model(validCollectionName, userSchema);

      const newTodo = new TodoModel({
        id,
        pw,
        email,
        name,
      });

      await newTodo.save();
      return res
        .status(201)
        .json({ message: "User created successfully", user: newTodo });
    }
  } catch (err) {
    console.error("데이터베이스에서 사용자 검색 중 오류:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
