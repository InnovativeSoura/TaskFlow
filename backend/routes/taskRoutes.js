const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  taskStats,
  searchTasks,
} = require("../controllers/taskController");

/*
=====================================
Task CRUD Routes
=====================================
*/

// Create Task
router.post("/", createTask);

// Get All Tasks
router.get("/", getTasks);

// Dashboard Statistics
router.get("/stats", taskStats);

// Search Tasks
router.get("/search", searchTasks);

// Get Single Task
router.get("/:id", getTask);

// Update Task
router.put("/:id", updateTask);

// Delete Task
router.delete("/:id", deleteTask);

module.exports = router;