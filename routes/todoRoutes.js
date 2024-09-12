const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
});

// 저장
router.post("/register", todoController.register);
// 삭제
router.delete("/register/:todoId", todoController.registerTodoId);
// 업데이트
router.put("/Update", todoController.Update);
// % DB저장
router.post("/completionRateSaveDB", todoController.completionRateSaveDB);
// 오늘 총 todo수 반환
router.post("/getCurrentTodo", todoController.getCurrentTodo);
// 오늘 완료된 todo수 반환
router.post("/getDoneTodo", todoController.getDoneTodo);
// 클릭한 날짜의 todo 반환
router.post("/showTodo", todoController.showTodo);
// 오늘 todo status 'completed'로 업데이트
router.put("/updateStatusCompleted", todoController.updateStatusCompleted);
// 오늘 todo status 'Pending'로 업데이트
router.put("/updateStatusPending", todoController.updateStatusPending);
// 어제 status 'Pending'인 todo 오늘로 날짜 업데이트
router.put("/StatusPendingYesterday", todoController.StatusPendingYesterday);
// localStorage와 DB동기화
router.get("/syncData", todoController.syncData);

module.exports = router;
