/*
1.start할때 nodemon 적용
scripts에 start : "nodemon 현재파일명(index)"
*index가 변경될때마다 서버가 자동으로 재실행 

*/

const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// index로 만들면 폴더를 가져와도 import가 된다.
const {
  login,
  accesstoken,
  refreshtoken,
  loginSuccess,
  logout,
} = require("./controller");

const app = express();
dotenv.config();

// 기본설정
app.use(express.json());
app.use(cookieParser());
// 서버간 origin이 다른상황에서 통신을 하기위해서
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.post("/login", login);
app.get("/accesstoken", accesstoken);
app.get("/refreshtoken", refreshtoken);
app.get("/login/success", loginSuccess);
app.post("/logout", logout);

// process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`server is on ${process.env.PORT}`);
});
