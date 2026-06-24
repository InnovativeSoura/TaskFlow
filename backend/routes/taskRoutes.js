const express = require("express");
const router = express.Router();

const {
createTask,
getTasks,
getTaskById,
updateTask,
deleteTask,
assignTask,
} = require("../controllers/taskController");

router.get("/", getTasks);

router.get("/:taskId", getTaskById);

router.post("/", createTask);

router.put("/:taskId", updateTask);

router.delete("/:taskId", deleteTask);

router.put("/:taskId/assign", assignTask);

module.exports = router;
