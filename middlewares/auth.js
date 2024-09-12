const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const redisClient = require("../config/redis");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET; // Access Token의 비밀 키
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Refresh Token의 비밀 키
const JWT_ACCESS_EXPIRATION_TIME = process.env.JWT_ACCESS_EXPIRATION_TIME; // Access Token의 유효 기간 (1시간)
const JWT_REFRESH_EXPIRATION_TIME = process.env.JWT_REFRESH_EXPIRATION_TIME; // Refresh Token의 유효 기간 (14일)

let AccessTokenSave = 0;

// cookie-parser를 웹에 추가
app.use(cookieParser());

// AccessToken 발행
function CreateAccessToken(id, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME) {
  const AccessToken = jwt.sign({ id }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION_TIME,
  });
  AccessTokenSave = AccessToken;
  console.log("Access token 발행");
  return AccessToken;
}

// RefreshToken 발행
function CreateRefreshToken(
  id,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION_TIME,
  res
) {
  const RefreshToken = jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION_TIME,
    issuer: "Better_Life", // 발급자 식별자
  });
  redisClient.set(
    // JSON.stringify({ id }),
    `${id}_RefreshToken`,
    `${RefreshToken}`,
    "EX",
    1209600
  );

  res.cookie(`${id}_RefreshToken`, RefreshToken, {
    httpOnly: true, // 자바스크립트에서 접근할 수 없도록 설정
    secure: true, // HTTPS에서만 쿠키를 전송
    sameSite: "Strict", // 크로스 사이트 요청에서 쿠키를 전송하지 않도록 설정
    maxAge: 1209600000, // 쿠키의 유효 기간 (2주)
  });

  console.log("refresh token 발행");
  return RefreshToken;
}

// Access token 보내기
app.get("/AccessToken", async (req, res) => {
  try {
    console.log("AccessTokenSave", AccessTokenSave);

    res.status(200).json(AccessTokenSave);
  } catch (err) {
    res.status(500).send("Error AccessTokenSave");
    console.log("err:", err);
  }
});

// 인증 미들웨어
exports.authenticateToken = async (req, res, AccessTokenSave) => {
  console.log("userID", userID);
  const cookieKey = `${userID}_RefreshToken`;
  const RefreshToken = req.cookies[cookieKey];
  console.log(`${userID}_RefreshToken`, RefreshToken);
  if (AccessTokenSave) {
    jwt.verify(AccessTokenSave, JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        console.log("AccessToken 형식X");
        return;
      }
      // req.user = user; // 요청 객체에 사용자 정보 추가
      // console.log("Refresh token인증된 사용자 : ", user);
      // next(); // 다음 미들웨어로 이동
    });
    console.log("AccessToken으로 인증되었습니다.");
    return AccessTokenSave;
  } else {
    if (RefreshToken == null) {
      console.log("cookie에서 가져온 Refresh token이 존재하지 않습니다. ");
      return;
    }
    console.log("cookie에서 가져온 Refresh token : ", RefreshToken);

    jwt.verify(RefreshToken, JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        console.log("cookie에서 가져온 Refresh token 형식X");
        return;
      }
      // req.user = user; // 요청 객체에 사용자 정보 추가
      // console.log("Refresh token인증된 사용자 : ", user);
      // next(); // 다음 미들웨어로 이동
    });

    // refresh로  Access 발급하는 함수 호출 ( 새로고침시 Access 초기화되는 문제 )
    // 1.id추출
    const RefreshPayload = RefreshToken.split(".")[1];
    const Refreshpayload = JSON.parse(atob(RefreshPayload));
    const id = Refreshpayload.id;
    console.log("payload.id:", id); // Payload에 포함된 id 값

    // 2.refresh 확인
    await getDataFromRedis(RefreshToken, id);

    let newAccessToken = CreateAccessToken(
      id,
      JWT_ACCESS_SECRET,
      JWT_ACCESS_EXPIRATION_TIME
    );
    console.log("newAccessToken : ", newAccessToken);

    let newRefreshToken = CreateRefreshToken(
      id,
      JWT_REFRESH_SECRET,
      JWT_REFRESH_EXPIRATION_TIME,
      res
    );
    console.log("newRefreshToken : ", newRefreshToken);

    return newAccessToken;
  }
};
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

// Redis에서 RefreshToken 가져와 비교
async function getDataFromRedis(RefreshToken, key) {
  try {
    // console.log("key", key);

    let RefreshTokenFormDB = await redisClient.get(`${key}_RefreshToken`);
    // console.log("RefreshTokenFormDB", RefreshTokenFormDB);

    if (RefreshTokenFormDB === null) {
      console.log(`No value found for key "${key}_RefreshToken".`);
      return;
    }

    if (RefreshToken !== RefreshTokenFormDB) {
      console.log(
        `Mismatched Refresh Token: Received "${RefreshToken}", Expected "${RefreshTokenFormDB}"`
      );
    } else {
      console.log("Tokens match.");
    }
    return;
  } catch (err) {
    console.error("Error fetching data from Redis:", err);
  }
}

// JWT인증이 필요한 라우트
// app.get("/protected", authenticateToken, (req, res) => {
//   res.json({
//     message: "You have access to this protected route!",
//     user: req.user,
//   });
// });

// 블랙리스트 추가 엔드포인트 (로그아웃 시)
// app.post("/logout", async (req, res) => {
//   const token = req.body.token;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const jti = decoded.jti || decoded.userId; // jti가 없다면 userId 사용

//     // JWT를 블랙리스트에 추가
//     const blacklistKey = `blacklist:${jti}`;
//     const ttl = Math.floor(decoded.exp - Date.now() / 1000); // 남은 만료 시간 계산
//     await redisClient.set(blacklistKey, "null", "EX", ttl);

//     res.json({ message: "Token has been blacklisted" });
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// });

// 요청 처리 시 블랙리스트 확인 미들웨어
// const checkBlacklist = async (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const jti = decoded.jti || decoded.userId;

//     // 블랙리스트 체크
//     const isBlacklisted = await redisClient.exists(`blacklist:${jti}`);
//     if (isBlacklisted) {
//       return res.status(401).json({ message: "Token is blacklisted" });
//     }

//     req.user = decoded; // 유저 정보 저장
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// refresh로 Access 재발급
// app.post("/refresh-token", async (req, res) => {
//   const { refreshToken } = req.cookies;

//   if (!refreshToken) return res.status(401).send("Unauthorized");

//   const tokenData = await redis.get(`${id}_RefreshToken `);

//   if (!tokenData) return res.status(401).send("Unauthorized");

//   const { userId } = JSON.parse(tokenData);

//   // 새로운 액세스 토큰 생성
//   const newAccessToken = generateAccessToken(userId);

//   res.cookie("access_token", newAccessToken, { httpOnly: true, secure: true });
//   res.send("New access token issued");
// });
