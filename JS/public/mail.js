const nodemailer = require("nodemailer");

// 구동하기 : node mail.js
const email2 = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f2f896eb8ed5b2",
    pass: "c9e0460e0b89fc",
  },
};

const send = async (data) => {
  nodemailer.createTransport(email2).sendMail(data, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
      return info.response;
    }
  });
};

function generateRandomNumber() {
  // 1000 이상 9999 이하의 랜덤한 정수 생성
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}
const randomNumber = generateRandomNumber();

const content = {
  from: "rlawhddlf0731@gmail.com",
  to: "b69184733f-ad054a@inbox.mailtrap.io",
  subject: "인증번호입니다.",
  html: `<p>인증번호 : ${randomNumber}</p>`,
};
send(content);

// 쿠키 만료 시간 설정 (현재 시간으로부터 3분 후)
const expirationTime = new Date();
expirationTime.setTime(expirationTime.getTime() + 3 * 60 * 1000); // 3분 후의 시간 설정

// 쿠키 설정
// document.cookie = `randomNumber=${randomNumber}; expires=${expirationTime.toUTCString()}; path=/`;
const cookie = require("cookie");
const http = require("http");

// HTTP 서버 생성
const server = http.createServer((req, res) => {
  // 쿠키 설정
  const randomNumber = Math.floor(Math.random() * 1000);
  const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 현재 시간으로부터 3분 후

  // 쿠키 생성
  const cookieString = cookie.serialize("randomNumber", String(randomNumber), {
    expires: expirationTime,
    httpOnly: true, // JavaScript로 쿠키에 접근하지 못하도록 설정
    path: "/", // 모든 경로에서 접근 가능하도록 설정
  });

  // 쿠키를 클라이언트에게 전송 (http응답 헤더에 쿠키 설정)
  res.setHeader("Set-Cookie", cookieString);

  // 응답
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("쿠키가 설정되었습니다.");
});

// 서버를 8080 포트에서 실행
server.listen(8080, () => {
  console.log("서버가 http://localhost:8080 에서 실행 중입니다.");
});
