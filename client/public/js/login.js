// const express = require('express')
// const dotenv = require('dotenv')
// const cookieParser = require('cookie-parser')
// const cors =require('cors')

// const app =express();
// dotenv.config()
// // process.env.PORT
// app.listen(process.env.PORT,()=>{
//     console.log(`server is on ${process.env.PORT}`)
// })

// 네이버 로그인
// var naver_id_login = new naver_id_login("O2oCB8KsFIC6P7WpacL9", "http://127.0.0.1:5500/HTML/");
// var state = naver_id_login.getUniqState();
// // naver_id_login.setButton("white", 2,40);
// naver_id_login.setDomain("http://127.0.0.1:5500/HTML/");
// naver_id_login.setState(state);
// naver_id_login.setPopup();
// naver_id_login.init_naver_id_login();
// const naver = document.querySelector('#naver_id_login a')
// naver.innerText = '네이버 로그인'

///6a58ec93e86dc8ba434ed7540d10477e
//     window.Kakao.init("6a58ec93e86dc8ba434ed7540d10477e");
// // 카카오톡 로그인
// function kakaoLogin() {
//     window.Kakao.Auth.login({
//         scope: 'profile_image,profile_nickname,friends', //동의항목 페이지에 있는 개인정보 보호 테이블의 활성화된 ID값을 넣습니다.
//         success: function(response) {
//             console.log(response) // 로그인 성공하면 받아오는 데이터
//             window.Kakao.API.request({ // 사용자 정보 가져오기
//                 url: '/v2/user/me',
//                 success: (res) => {
//                     const kakao_account = res.kakao_account;
//                     console.log(kakao_account)
//                 }
//             });
//              window.location.href='http://127.0.0.1:5500/HTML/' //리다이렉트 되는 코드
//         },
//         fail: function(error) {
//             console.log(error);
//         }
//     });
// }

// // 카카오톡 :로그아웃
//     function kakaoLogout() {
//     if (!Kakao.Auth.getAccessToken()) {
//         console.log('Not logged in.');
//         return;
//     }
//     Kakao.Auth.logout(function(response) {
//         alert(response +' logout');
//         window.location.href='/'
//     });
//     };
// // 카카오톡 : 회원탈퇴(연결 끊기)
//     function secession() {
//     Kakao.API.request({
//     url: '/v1/user/unlink',
//     success: function(response) {
//         console.log(response);
//         //callback(); //연결끊기(탈퇴)성공시 서버에서 처리할 함수
//         window.location.href='/'
//     },
//     fail: function(error) {
//         console.log('탈퇴 미완료')
//         console.log(error);
//     },
//     });
//     };

const loginInput = document.querySelector(".login-input");

loginInput.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginInput);
  const id = formData.get("id");
  const password = formData.get("password");
  console.log(id, password);
  CreateToken(id, password);
});

async function CreateToken(id, pw) {
  console.log(`id:${id},pw:${pw}`);
  await fetch("http://localhost:3000/login/userLogin", {
    method: "POST",
    body: JSON.stringify({ id, pw }),
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      } else if (response.status === 204) {
        window.location.href = "/";
      }
    })

    .catch((error) => {
      console.error(error);
    });
}

// const kakaoLogin = document.querySelector("#login-with-kakao");
// kakaoLogin.addEventListener("click", function () {
//   alert("AccessToken : ", AccessToken);
//   console.log("AccessToken : ", AccessToken);
// });
