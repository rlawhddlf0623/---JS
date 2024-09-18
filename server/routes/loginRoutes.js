const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
});

// 로그인시 요청
router.post("/userLogin", loginController.userLogin);

module.exports = router;
