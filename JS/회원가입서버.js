const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const port = 3000;
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

// 스키마 및 모델 설정
// const userSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });
const userSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },

  // description: {
  //   type: String,
  //   required: true,
  // },
  date: {
    type: Date,
    default: Date.now,
  },
});

// 사용자 모델 생성
// const User = mongoose.model("col1", userSchema); // 'col1' 컬렉션을 지정
const User = mongoose.model("col2", userSchema); // 'col2' 컬렉션을 지정

// 'public' 디렉토리 안의 파일들을 정적 파일로 제공 (path.join으로 절대경로 제공)
// public디렉토리의 정적파일 제공
app.use(express.static(path.join(__dirname, "public")));

// 사용자 입력 폼 라우트
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "public", "join_membership.html"));
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 사용자 데이터 저장 라우트 (async/await 사용)
// 회원가입 라우트
app.post("/register", async (req, res) => {
  // const { name, email, id, pw } = req.body;
  const { todo } = req.body;
  // 필수 필드가 모두 제공되었는지 확인
  // if (!id || !pw || !email || !name) {
  //   return res.status(400).send("All fields are required.");
  // }

  try {
    // 비밀번호 암호화
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(pw, salt);

    // // 새 사용자 생성
    // const newUser = new User({
    //   name,
    //   email,
    //   id,
    //   password: hashedPassword,
    // });

    // 새 사용자 생성
    const newUser = new User({
      todo,
    });

    // 사용자 데이터 저장
    await newUser.save();
    res.sendFile(path.join(__dirname, "public", "login.html"));
    //res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send("Error registering user");
    console.log("err:", err);
  }
});

// 서버 시작
app.listen(port, () => {
  console.log("Server is running on http://localhost:3000");
});
