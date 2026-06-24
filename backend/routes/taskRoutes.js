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

router.get("/", getTaskById);

router.post("/", createTask);

router.put("/", updateTask);

router.delete("/", deleteTask);

router.put("//assign", assignTask);

module.exports = router;
