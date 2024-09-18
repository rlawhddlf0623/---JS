let userID = ""; // 초기 값 설정

// AccessToken을 설정하는 함수
function setUserId(id) {
  userID = id;
  console.log("setUserId()의 userID", userID);
}

// AccessToken을 반환하는 함수
function getUserId() {
  return userID;
}

// 모듈을 내보냄
module.exports = {
  setUserId,
  getUserId,
};
