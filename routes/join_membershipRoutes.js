const express = require("express");
const router = express.Router();
const join_membershipController = require("../controllers/join_membershipController");

// 회원가입시 요청
router.post("/UserCollection", join_membershipController.UserCollection);

module.exports = router;
