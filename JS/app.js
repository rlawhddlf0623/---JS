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

//todo 저장
app.post("/register", async (req, res) => {
  try {
    const { id, todo } = req.body;

    const newTodo = new Todo({
      id,
      todo,
    });
    const savedTodo = await newTodo.save();
    // 사용자 문서에 새로운 ToDo 항목 추가
    /*
    await User.findByIdAndUpdate(userId, {
      $push: { todos: savedTodo._id },
    });
  */
    res.status(200).json(newTodo);
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
      res
        .status(200)
        .json({ message: `Todo with ID ${todoId} deleted successfully.` });
    } else {
      res.status(404).json({ error: "Todo not found." });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo." });
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
