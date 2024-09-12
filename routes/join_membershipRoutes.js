const express = require("express");
const router = express.Router();
const join_membershipController = require("../controllers/join_membershipController");
const path = require("path");

// 회원가입시 요청
router.post("/UserCollection", join_membershipController.UserCollection);

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "join_membership.html"));
});

module.exports = router;
