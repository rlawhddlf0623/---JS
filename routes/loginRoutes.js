const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// 로그인시 요청
router.post("/login", loginController.login);

module.exports = router;
