const User = require("../server/routes/models/User");
const bcrypt = require("bcrypt");
const {
  CreateAccessToken,
  CreateRefreshToken,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_TIME,
  JWT_REFRESH_EXPIRATION_TIME,
} = require("../middlewares/auth");
const { setUserId, getUserId } = require("../server/routes/models/userID");

exports.userLogin = async (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) {
    return res.status(400).json({ error: "id and pw are required" });
  }

  console.log("id, pw", id, pw);
  try {
    // 1.DB에서 사용자 확인
    // id로 사용자 찾기
    const user = await User.findOne({ id });
    // 사용자 존재 여부 확인
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(pw, user.pw);
    console.log("pw : ", pw);
    console.log("user.pw : ", user.pw);
    console.log("isMatch : ", isMatch);
    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }

    let AccessToken = CreateAccessToken(
      id,
      JWT_ACCESS_SECRET,
      JWT_ACCESS_EXPIRATION_TIME
    );
    console.log("AccessToken : ", AccessToken);

    let RefreshToken = CreateRefreshToken(
      id,
      JWT_REFRESH_SECRET,
      JWT_REFRESH_EXPIRATION_TIME,
      res
    );
    console.log("RefreshToken : ", RefreshToken);

    setUserId(id);

    res.status(204).send();
  } catch (err) {
    res.status(500).send("token can't make it");
    console.log("err:", err);
  }
};
