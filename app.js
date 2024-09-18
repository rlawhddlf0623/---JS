const express = require("express");
const app = express();
const todoRouter = require("./routes/todoRoutes");
const loginRoutes = require("./routes/loginRoutes");
const join_membershipRoutes = require("./routes/join_membershipRoutes");

// const redisClient = require("./db/redis");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
const path = require("path");
// const bcrypt = require("bcrypt");

const dotenv = require("dotenv").config();

// const User = require("./model/User");
// // const Todo = require("./model/Todo");
// const Rate = require("./model/Rate");
const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT;

// cookie-parser를 웹에 추가
// app.use(cookieParser());

// Body-parser middleware 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 'public' 디렉토리 안의 파일들을 정적 파일로 제공 (path.join으로 절대경로 제공)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/", todoRouter);
app.use("/login", loginRoutes);
app.use("/join_membership", join_membershipRoutes);

// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET; // Access Token의 비밀 키
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Refresh Token의 비밀 키
// const JWT_ACCESS_EXPIRATION_TIME = process.env.JWT_ACCESS_EXPIRATION_TIME; // Access Token의 유효 기간 (1시간)
// const JWT_REFRESH_EXPIRATION_TIME = process.env.JWT_REFRESH_EXPIRATION_TIME; // Refresh Token의 유효 기간 (14일)

// function CreateAccessToken(id, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME) {
//   const AccessToken = jwt.sign({ id }, JWT_ACCESS_SECRET, {
//     expiresIn: JWT_ACCESS_EXPIRATION_TIME,
//   });
//   AccessTokenSave = AccessToken;
//   console.log("Access token 발행");
//   return AccessToken;
// }
// function CreateRefreshToken(
//   id,
//   JWT_REFRESH_SECRET,
//   JWT_REFRESH_EXPIRATION_TIME,
//   res
// ) {
//   const RefreshToken = jwt.sign({ id }, JWT_REFRESH_SECRET, {
//     expiresIn: JWT_REFRESH_EXPIRATION_TIME,
//     issuer: "Better_Life", // 발급자 식별자
//   });
//   redisClient.set(
//     // JSON.stringify({ id }),
//     `${id}_RefreshToken`,
//     `${RefreshToken}`,
//     "EX",
//     1209600
//   );

//   res.cookie(`${id}_RefreshToken`, RefreshToken, {
//     httpOnly: true, // 자바스크립트에서 접근할 수 없도록 설정
//     secure: true, // HTTPS에서만 쿠키를 전송
//     sameSite: "Strict", // 크로스 사이트 요청에서 쿠키를 전송하지 않도록 설정
//     maxAge: 1209600000, // 쿠키의 유효 기간 (2주)
//   });

//   console.log("refresh token 발행");
//   return RefreshToken;
// }

// let userID = 0;
// app.post("/login", async (req, res) => {
//   const { id, pw } = req.body;
//   if (!id || !pw) {
//     return res.status(400).json({ error: "id and pw are required" });
//   }
//   userID = id;
//   console.log("id, pw", id, pw);
//   try {
//     // 1.DB에서 사용자 확인
//     // id로 사용자 찾기
//     const user = await User.findOne({ id });
//     // 사용자 존재 여부 확인
//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     // 비밀번호 확인
//     const isMatch = await bcrypt.compare(pw, user.pw);
//     console.log("pw : ", pw);
//     console.log("user.pw : ", user.pw);
//     console.log("isMatch : ", isMatch);
//     if (!isMatch) {
//       return { success: false, message: "Invalid password" };
//     }

//     let AccessToken = CreateAccessToken(
//       id,
//       JWT_ACCESS_SECRET,
//       JWT_ACCESS_EXPIRATION_TIME
//     );
//     console.log("AccessToken : ", AccessToken);

//     let RefreshToken = CreateRefreshToken(
//       id,
//       JWT_REFRESH_SECRET,
//       JWT_REFRESH_EXPIRATION_TIME,
//       res
//     );
//     console.log("RefreshToken : ", RefreshToken);

//     res.status(200).json({ AccessToken });
//   } catch (err) {
//     res.status(500).send("token can't make it");
//     console.log("err:", err);
//   }
// });

// Access token 보내기
// app.get("/AccessToken", async (req, res) => {
//   try {
//     console.log("AccessTokenSave", AccessTokenSave);

//     res.status(200).json(AccessTokenSave);
//   } catch (err) {
//     res.status(500).send("Error AccessTokenSave");
//     console.log("err:", err);
//   }
// });

// 인증 미들웨어
// async function authenticateToken(req, res, AccessTokenSave) {
//   console.log("userID", userID);
//   const cookieKey = `${userID}_RefreshToken`;
//   const RefreshToken = req.cookies[cookieKey];
//   console.log(`${userID}_RefreshToken`, RefreshToken);
//   if (AccessTokenSave) {
//     jwt.verify(AccessTokenSave, JWT_ACCESS_SECRET, (err, user) => {
//       if (err) {
//         console.log("AccessToken 형식X");
//         return;
//       }
//       // req.user = user; // 요청 객체에 사용자 정보 추가
//       // console.log("Refresh token인증된 사용자 : ", user);
//       // next(); // 다음 미들웨어로 이동
//     });
//     console.log("AccessToken으로 인증되었습니다.");
//     return AccessTokenSave;
//   } else {
//     if (RefreshToken == null) {
//       console.log("cookie에서 가져온 Refresh token이 존재하지 않습니다. ");
//       return;
//     }
//     console.log("cookie에서 가져온 Refresh token : ", RefreshToken);

//     jwt.verify(RefreshToken, JWT_REFRESH_SECRET, (err, user) => {
//       if (err) {
//         console.log("cookie에서 가져온 Refresh token 형식X");
//         return;
//       }
//       // req.user = user; // 요청 객체에 사용자 정보 추가
//       // console.log("Refresh token인증된 사용자 : ", user);
//       // next(); // 다음 미들웨어로 이동
//     });

//     // refresh로  Access 발급하는 함수 호출 ( 새로고침시 Access 초기화되는 문제 )
//     // 1.id추출
//     const RefreshPayload = RefreshToken.split(".")[1];
//     const Refreshpayload = JSON.parse(atob(RefreshPayload));
//     const id = Refreshpayload.id;
//     console.log("payload.id:", id); // Payload에 포함된 id 값

//     // 2.refresh 확인
//     await getDataFromRedis(RefreshToken, id);

//     let newAccessToken = CreateAccessToken(
//       id,
//       JWT_ACCESS_SECRET,
//       JWT_ACCESS_EXPIRATION_TIME
//     );
//     console.log("newAccessToken : ", newAccessToken);

//     let newRefreshToken = CreateRefreshToken(
//       id,
//       JWT_REFRESH_SECRET,
//       JWT_REFRESH_EXPIRATION_TIME,
//       res
//     );
//     console.log("newRefreshToken : ", newRefreshToken);

//     return newAccessToken;
//   }
// }

// async function getDataFromRedis(RefreshToken, key) {
//   try {
//     // console.log("key", key);

//     let RefreshTokenFormDB = await redisClient.get(`${key}_RefreshToken`);
//     // console.log("RefreshTokenFormDB", RefreshTokenFormDB);

//     if (RefreshTokenFormDB === null) {
//       console.log(`No value found for key "${key}_RefreshToken".`);
//       return;
//     }

//     if (RefreshToken !== RefreshTokenFormDB) {
//       console.log(
//         `Mismatched Refresh Token: Received "${RefreshToken}", Expected "${RefreshTokenFormDB}"`
//       );
//     } else {
//       console.log("Tokens match.");
//     }
//     return;
//   } catch (err) {
//     console.error("Error fetching data from Redis:", err);
//   }
// }

// const todoUserSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//   },
//   todo: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "completed"],
//     default: "pending",
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });
// 개발시 임시로 collection 고정
// let TodoModel = mongoose.model("user3", todoUserSchema);

// function TodayDate() {
//   const now = new Date();
//   const startOfDay = new Date(now.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(now.setHours(23, 59, 59, 999));
//   // console.log("TodayDate", startOfDay, endOfDay);
//   return [startOfDay, endOfDay];
// }

let validCollectionName = 0;
// 회원정보 저장 + 사용자id로 todo collection만들기
// app.post("/UserCollection", async (req, res) => {
//   const { id, pw, email, name } = req.body;
//   console.log(id, pw, email, name);
//   if (!id || !pw || !email || !name) {
//     return res
//       .status(400)
//       .json({ error: "Collection name and todo are required" });
//   }

//   try {
//     // 사용자 입력 이메일과 동일한 이메일을 가진 문서를 찾습니다.
//     const existingUser = await User.findOne({ email: email });

//     if (existingUser) {
//       console.log("Email already exists");
//       return res.status(400).json({ error: "Email already exists" });
//     } else {
//       console.log("사용할 수 있는 이메일입니다.");
//       //users에 저장
//       const newUser = new User({ id, pw, email, name });
//       await newUser.save();

//       validCollectionName = id.replace(/[^a-zA-Z0-9]/g, "");
//       // console.log("validCollectionName(회원가입): ", validCollectionName);
//       // 사용자id로 collection만들기( collection 만들때 document 1개는 필수로 생성 )
//       // const TodoModel = CreateCollection(validCollectionName);
//       // await new TodoModel({
//       //   id: id,
//       //   todo: "first create todo",
//       //   status: "pending",
//       // }).save();

//       return res.status(201).json({ message: "User created successfully" });
//     }
//   } catch (err) {
//     console.error("데이터베이스에서 사용자 검색 중 오류:", err);
//     return res.status(500).json({ error: "Database error" });
//   }
// });

// //todo 저장
// app.post("/register", async (req, res) => {
//   try {
//     const { id, todo, AccessTokenSave } = req.body;
//     // console.log("req.body", req.body);
//     // const AccessTokenSave = req.body.AccessTokenSave;
//     // console.log("AccessTokenSave : ", AccessTokenSave);
//     let AccessToken = await authenticateToken(req, res, AccessTokenSave);

//     // if (!authenticate_Token) {
//     //   // authenticateToken안에서 응답을 보내고 있어 중복된 응답을 보내서 에러가 발생한다.
//     //   console.log("Refresh token 인증 에러");
//     //   return res.status(400).json({ error: "Access token Error" });
//     // }

//     // const { id, todo } = req.body;
//     if (!id || !todo) {
//       return res.status(400).json({ error: "ID and todo are required" });
//     }

//     // console.log("validCollectionName(todo저장)", validCollectionName);
//     // const TodoModel = CreateCollection(validCollectionName);

//     const newTodo = new TodoModel({
//       id,
//       todo,
//     });
//     await newTodo.save();

//     let [startOfDay, endOfDay] = TodayDate();
//     // 오늘의 todos를 조회
//     const count = await TodoModel.countDocuments({
//       date: { $gte: startOfDay, $lte: endOfDay },
//     });

//     res.status(200).json({ newTodo, count, AccessToken });
//   } catch (err) {
//     console.log("err:", err);
//     res.status(500).send("Error registering user");
//   }
// });

// //todo 삭제
// app.delete("/register/:todoId", async (req, res) => {
//   const { todoId, AccessTokenSave } = req.body;

//   // Access token 인증
//   let AccessToken = await authenticateToken(req, res, AccessTokenSave);

//   try {
//     // const TodoModel = CreateCollection(validCollectionName);
//     const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
//     // console.log("deletedTodo", deletedTodo);

//     let [startOfDay, endOfDay] = TodayDate();
//     if (deletedTodo) {
//       const count = await TodoModel.countDocuments({
//         date: { $gte: startOfDay, $lte: endOfDay },
//       });
//       // console.log("count", count);
//       // console.log("새로 발급한 AccessToken", AccessToken);

//       res.status(200).json({ count, AccessToken });
//     } else {
//       res.status(404).json({ error: "Todo not found." });
//     }
//   } catch (error) {
//     console.error("Error deleting todo:", error);
//     res.status(500).json({ error: "Failed to delete todo." });
//   }
// });

// //Update
// app.put("/Update", async (req, res) => {
//   const { todoId, update, AccessTokenSave } = req.body;

//   // Access token 인증
//   let newAccessToken = await authenticateToken(req, res, AccessTokenSave);
//   console.log("Update의 newAccessToken", newAccessToken);
//   if (!todoId || !update) {
//     return res.status(400).json({ success: false, message: "Invalid data" });
//   }
//   console.log("todoId ,update", todoId, update);
//   try {
//     // const TodoModel = CreateCollection(validCollectionName);
//     const updatedTodo = await TodoModel.findByIdAndUpdate(
//       todoId,
//       { todo: update },
//       { new: true, runValidators: true }
//     );
//     // console.log(updatedTodo);
//     if (!updatedTodo) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Todo not found" });
//     }

//     res.json({ newAccessToken });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "An error occurred" });
//   }
// });

// app.post("/completionRateSaveDB", async (req, res) => {
//   const { weeksArray, AccessTokenSave } = req.body;
//   // console.log(weeksArray, AccessTokenSave);
//   let newAccessToken = await authenticateToken(req, res, AccessTokenSave);

//   if (!Array.isArray(weeksArray)) {
//     throw new Error("Rate must be an array of strings");
//   }
//   // console.log("weeksArray", weeksArray);
//   if (!weeksArray) {
//     return res.status(400).json({ error: "weeksArray are required" });
//   }
//   let currentDate = "24년8월";
//   try {
//     const updatedTodo1 = await Rate.findOne({ id: currentDate });
//     // console.log(updatedTodo1);

//     if (!updatedTodo1) {
//       const completionRate = await new Rate({
//         id: currentDate,
//         Rate: weeksArray,
//       });
//       // console.log("new", completionRate);
//       await completionRate.save();
//       res.status(200).json({ completionRate, newAccessToken });
//     } else {
//       const completionRate = await Rate.findOneAndUpdate(
//         { id: currentDate },
//         { Rate: weeksArray },
//         { new: true, runValidators: true }
//       );
//       // console.log("update", completionRate);
//       res.status(200).json({ completionRate, newAccessToken });
//     }

//     // const TodoModel = CreateCollection(validCollectionName);
//     // const completionRate = new Rate({
//     //   id: "24년8월",
//     //   Rate: weeksArray,
//     // });

//     // await completionRate.save();

//     // res.status(200).json({ completionRate });
//   } catch (err) {
//     res.status(500).send("Error completionRateSaveDB");
//     console.log("err:", err);
//   }
// });

// // localStorage와 DB동기화
// app.get("/syncData", async (req, res) => {
//   try {
//     // 현재 날짜를 기준으로 할 때, 날짜를 문자열로 변환
//     let [startOfDay, endOfDay] = TodayDate();
//     // const TodoModel = CreateCollection(validCollectionName);
//     // 현재 날짜의 todos를 조회
//     // console.log(startOfDay, endOfDay);
//     const todos = await TodoModel.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//     });

//     // 클라이언트에 데이터 전송
//     // console.log("현재 날짜의 todos", todos);
//     res.status(200).json(todos);
//     // res.json(todos);
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Read (현재 todo수 반환)
// app.post("/getCurrentTodo", async (req, res) => {
//   try {
//     let [start, end] = TodayDate();
//     // const TodoModel = CreateCollection(validCollectionName);
//     const count = await TodoModel.countDocuments({
//       date: { $gte: start, $lte: end },
//     });

//     res.status(200).json(count);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error counting documents");
//   }
// });

// app.post("/showTodo", async (req, res) => {
//   try {
//     const calendarClickValue = req.body.clickDate;
//     console.log("클릭한 날짜  : ", calendarClickValue);
//     // 입력 받은 날짜를 자바스크립트 Date 객체로 변환
//     const inputDate = new Date(calendarClickValue);
//     console.log("calendarClickValue  : ", calendarClickValue);
//     const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0)); // 00:00:00
//     const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999)); // 23:59:59
//     // console.log("startOfDay, endOfDay", startOfDay, endOfDay);

//     const todos = await TodoModel.find({
//       date: {
//         $gte: startOfDay, // 해당 날짜의 시작 시간
//         $lte: endOfDay, // 해당 날짜의 끝 시간
//       },
//     });
//     console.log("todos : ", todos);
//     res.status(200).json(todos);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error counting documents");
//   }
// });

// app.post("/getDoneTodo", async (req, res) => {
//   try {
//     // const TodoModel = CreateCollection(validCollectionName);

//     let [start, end] = TodayDate();
//     const count = await TodoModel.countDocuments({
//       status: "completed",
//       date: { $gte: start, $lte: end },
//     });
//     res.status(200).json({ completedCount: count });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error counting completed todos");
//   }
// });

// status 'completed'로 업데이트하는 엔드포인트
// app.put("/updateStatusCompleted/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const AccessTokenSave = req.AccessTokenSave;
//     let newAccessToken = await authenticateToken(req, res, AccessTokenSave);

//     // console.log("Received ID1:", id);
//     if (!id) {
//       return res.status(400).send("ID is required");
//     }

//     // console.log("Received ID2:", id);
//     // const TodoModel = CreateCollection(validCollectionName);
//     const updatedTodo = await TodoModel.findOneAndUpdate(
//       { _id: id },
//       { status: "completed" },
//       { new: true }
//     );
//     // console.log("Received ID3:", id);
//     // console.log("updatedTodo", updatedTodo);
//     if (updatedTodo) {
//       res.status(200).json({ updatedTodo, newAccessToken });
//     } else {
//       res.status(404).send("Todo not found");
//     }
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).send("Error updating status");
//   }
// });
// status 'Pending'로 업데이트하는 엔드포인트
// app.put("/updateStatusPending/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const TodoModel = CreateCollection(validCollectionName);
//     const AccessTokenSave = req.AccessTokenSave;
//     let newAccessToken = await authenticateToken(req, res, AccessTokenSave);

//     const updatedTodo = await TodoModel.findOneAndUpdate(
//       { _id: id },
//       { status: "pending" },
//       { new: true }
//     );

//     if (updatedTodo) {
//       res.status(200).json({ updatedTodo, newAccessToken });
//     } else {
//       res.status(404).send("Todo not found");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error updating status");
//   }
// });

// app.put("/StatusPendingYesterday/", async (req, res) => {
//   // 하루 전 날짜 계산
//   const oneDayAgo = new Date();
//   oneDayAgo.setDate(oneDayAgo.getDate() - 1);

//   const startOfDay = new Date(oneDayAgo);
//   startOfDay.setHours(0, 0, 0, 0); // 어제의 시작 시간

//   const endOfDay = new Date(oneDayAgo);
//   endOfDay.setHours(23, 59, 59, 999); // 어제의 끝 시간

//   // 현재 날짜와 시간
//   const currentDate = new Date();
//   console.log("currentDate", currentDate);
//   try {
//     const AccessTokenSave = req.AccessTokenSave;
//     let newAccessToken = await authenticateToken(req, res, AccessTokenSave);

//     const result = await TodoModel.updateMany(
//       {
//         status: "pending", // 상태가 "pending"인 항목
//         date: {
//           $gte: startOfDay, // 해당 날짜의 시작 시간
//           $lte: endOfDay, // 해당 날짜의 끝 시간
//         },
//       },
//       {
//         $set: { date: currentDate }, // date를 현재 날짜로 업데이트
//       }
//     );

//     const yesterdayTodo = await TodoModel.find({
//       status: "pending", // 상태가 "pending"인 항목
//       date: {
//         $gte: startOfDay, // 해당 날짜의 시작 시간
//         $lte: endOfDay, // 해당 날짜의 끝 시간
//       },
//     });
//     console.log("yesterdayTodo", yesterdayTodo);

//     if (result) {
//       console.log(`어제의 todo 이동완료`);
//       res.status(200).json({ newAccessToken });
//     } else {
//       res.status(404).send("어제 완료하지 못한 todo가 없습니다.");
//       console.log("어제 완료하지 못한 todo가 없습니다.");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error updating status");
//   }
// });

// 서버 시작

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// function CreateCollection(collectionName) {
//   let TodoModel;

//   try {
//     TodoModel = mongoose.model(collectionName);
//   } catch (error) {
//     if (error.name === "MissingSchemaError") {
//       TodoModel = mongoose.model(collectionName, todoUserSchema);
//     } else {
//       throw error;
//     }
//   }
//   return TodoModel;
// }
