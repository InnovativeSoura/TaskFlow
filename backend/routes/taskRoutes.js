import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrManager } from "../middleware/permissions.js";

const router = express.Router();

/* ==========================================
   GLOBAL PROTECTION
========================================== */
router.use(protect);

/* ==========================================
   TASK ROUTES
========================================== */

// Create task
router.post("/", isAdminOrManager, createTask);

// Get all tasks (filterable)
router.get("/", isAdminOrManager, getTasks);

// Get task by ID
router.get("/:id", isAdminOrManager, getTaskById);

// Update task details
router.put("/:id", isAdminOrManager, updateTask);

// Update task status
router.patch("/:id/status", isAdminOrManager, updateTaskStatus);

// Delete task (Admin only)
router.delete("/:id", isAdmin, deleteTask);

export default router;