// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');

// const app = express();

// // Body-parser 설정
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // 이메일 전송 핸들러
// app.post('/send-email', (req, res) => {
//     // 사용자로부터 입력받은 이메일 주소
//     // const userEmail = req.body.email;
//     const userEmail = 'sponge1205@naver.com'
//     // Nodemailer transporter 생성
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.naver.com',
//         port: 465, // SSL 보안 연결용 포트
//         secure: true, // true for 465, false for other ports
//         auth: {
//             user: 'rlawhddlf0623l@naver.com', // 네이버 이메일 주소
//             pass: '910224qaz@' // 네이버 이메일 비밀번호
//         }
//     });

//     // 이메일 옵션 설정
//     const mailOptions = {
//         from: 'rlawhddlf0623@naver.com', // 보내는 사람 이메일 주소
//         to: userEmail, // 받는 사람 이메일 주소
//         subject: '이메일 확인', // 이메일 제목
//         html: '<p>회원가입을 위한 확인용 링크: <a href="https://example.com/confirm-email?token=confirmation_token">여기를 클릭하세요</a></p>' // 이메일 본문 (HTML 형식)
//     };







//     // 이메일 전송
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('이메일 전송 오류:', error);
//             res.status(500).send('이메일 전송에 실패했습니다.');
//         } else {
//             console.log('이메일이 성공적으로 전송되었습니다:', info.response);
//             res.status(200).send('이메일이 성공적으로 전송되었습니다.');
//         }
//     });
// });

// // 서버 시작
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
// });
