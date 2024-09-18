let accessToken = ""; // 초기 값 설정

// AccessToken을 설정하는 함수
function setAccessToken(token) {
  accessToken = token;
  console.log("setAccessToken()안 accessToken :", accessToken);
}

// AccessToken을 반환하는 함수
function getAccessToken() {
  return accessToken;
}

// 모듈을 내보냄
module.exports = {
  setAccessToken,
  getAccessToken,
};
