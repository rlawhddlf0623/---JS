const userDatabase = require("../database");
const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  const { email, password } = req.body;

  const userInfo = userDatabase.filter((item) => {
    return item.email === email;
  })[0];
  if (!userInfo) {
    res.status(403).json("Not Authorized");
  } else {
    try {
      // access Token 발급
      const accesstoken = jwt.sign(
        {
          // 1.sign함수에 어떤 유저정보를 담을지 지정
          // 2.토큰에 대한정보

          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.username,
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: "1m",
          issuer: "Better Life",
        }
      );
      // refresh Token 발급
      const refreshtoken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.username,
        },
        process.env.REFRECH_SECRET,
        {
          expiresIn: "24h",
          issuer: "Better Life",
        }
      );

      // token을 cookie에 담고 전송
      res.cookie("accessToken", accesstoken, {
        // http와 https의 차이명시
        secure: false,
        // js,http어디서 접근가능할지
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshtoken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json("login success");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

const accesstoken = (req, res) => {
  try {
    // 브라우저에 저장되어 있는 cookie안에 accesstoken값
    const token = req.cookies.accesstoken;
    // token값을 통해서 사용자를 식별하기 위해서
    const data = jwt.verify(token, process.env.REFRECH_SECRET);

    const userData = userDatabase.filter((item) => {
      return item.email === data.email;
    })[0];
    // pw제외
    const { password, ...others } = userData;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
};
const refreshtoken = (req, res) => {
  // access token 갱신
  try {
    const token = req.cookie.refreshtoken;
    const data = jwt.verify(token, process.env.REFRECH_SECRET);
    const userData = userDatabase.filter((item) => {
      return item.email === data.email;
    })[0];

    // access token 새로 발급
    const accesstoken = jwt.sign(
      {
        // 1.sign함수에 어떤 유저정보를 담을지 지정
        // 2.토큰에 대한정보

        id: userData.id,
        username: userData.username,
        email: userData.username,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "1m",
        issuer: "Better Life",
      }
    );
    res.cookie("accessToken", accesstoken, {
      // http와 https의 차이명시
      secure: false,
      // js,http어디서 접근가능할지
      httpOnly: true,
    });

    res.status(200).json("Access Token Recreated");
  } catch (error) {
    res.status(500).json(error);
  }
};
const loginSuccess = (req, res) => {
  try {
    const token = req.cookies;
    // token을 복호화
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const userData = userDatabase.filter((item) => {
      return item.email === data.email;
    })[0];
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
};
const logout = (req, res) => {
  try {
    // token을 빈값으로 갱신
    req.cookie("accessToken", "");
    res.status(200).json("Logout Success");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  login,
  accesstoken,
  refreshtoken,
  loginSuccess,
  logout,
};
