// ckeckbox 모두 체크
let chkCheckAll = document.querySelector("#chk_checkall");
let chkSubs = document.querySelectorAll(".chk_sub");
chkCheckAll.addEventListener("change", function () {
  for (let i = 0; i < chkSubs.length; i++) {
    chkSubs[i].checked = this.checked;
  }
});

const a = document.querySelector(".form-group input");
a.addEventListener("click", function () {
  a.classList.add(".input-boerder");
});

// input의 공백체크
var inputs = document.querySelectorAll(".form-group input");
// 각 input 요소에 이벤트 리스너 추가하기
inputs.forEach(function (input) {
  let input_focus_count = 0;
  input.addEventListener("focus", function () {
    // 처음 focus되면 초록색
    if (input_focus_count === 0) {
      this.style.border = "1px solid green";
      input_focus_count++;
    }
    //  focus가 해제될때 input이 공백이면
    input.addEventListener("blur", function () {
      if (this.value.trim() === "") {
        this.style.border = "1px solid red";
      }
    });
  });
});

// input 양식체크
function validateForm() {
  var id = document.getElementById("id").value;
  var email = document.getElementById("email").value;

  if (!validateUsername(id)) {
    alert("아이디 형식이 올바르지 않습니다.");
    return false;
  }

  if (!validateEmail(email)) {
    alert("이메일 형식이 올바르지 않습니다.");
    return false;
  }

  return true;
}

// 아이디
// function validateUsername(username) {
//     // 아이디는 영문자, 숫자, 언더스코어(_)만 허용되고, 길이는 3자 이상 16자 이하여야 합니다.
//     var usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
//     return usernameRegex.test(id);
//   }
// //   이메일
// function validateEmail(email) {
//     // 이메일 형식을 검증하는 정규 표현식입니다.
//     var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   }

// 이메일 인증번호 유효성검사
/*
const certifyNumber = document.querySelector('#certify');
certifyNumber.addEventListener('input',function(){
  let certifyValue = certifyNumber.value;
  // 사용자 입력값
  console.log(certifyValue)
*/

// cookie에서 가져온값
// const cookies = document.cookie.split("; ");
// for (let i = 0; i < cookies.length; i++) {
//   const cookie = cookies[i].split("=");
//   if (cookie[0] === "randomNumber") {
//     const randomNumber = cookie[1];
//     console.log("인증번호:", randomNumber);

//     if (certifyValuecertifyValue == randomNumber) {
//       alert("이메일 인증 성공");
//     }
//   }
// }

document
  .getElementById("register")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value;
    const pw = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;

    fetch("http://localhost:3000/join_membership/UserCollection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, pw, email, name }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
