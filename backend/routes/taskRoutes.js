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
import {
  isAdmin,
  isAdminOrManager,
} from "../middleware/permissions.js";

const router = express.Router();

/* ==========================================
   GLOBAL PROTECTION
========================================== */

router.use(protect);

/* ==========================================
   TASK ROUTES
========================================== */

// Get all tasks (All authenticated users)
router.get("/", getTasks);

// Get single task (All authenticated users)
router.get("/:id", getTaskById);

// Create task (Admin & Manager)
router.post("/", isAdminOrManager, createTask);

// Update entire task (Admin & Manager)
router.put("/:id", isAdminOrManager, updateTask);

// Update task status (All authenticated users)
router.patch("/:id/status", updateTaskStatus);

// Delete task (Admin only)
router.delete("/:id", isAdmin, deleteTask);

export default router;