const express = require("express");
const router = express.Router();

const {
  getTasks,
  assignTask,
} = require("../controllers/taskController");

router.get("/", getTasks);

router.put(
  "/:taskId/assign",
  assignTask
);

module.exports = router;