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
router.get("/", protect, getTasks);

// Get single task (All authenticated users)
router.get("/:id", protect, getTaskById);

// Create task (Admin & Manager)
router.post("/", protect, isAdminOrManager, createTask);

// Update entire task (Admin & Manager)
router.put("/:id", protect, isAdminOrManager, updateTask);

// Update task status (All authenticated users)
router.patch("/:id/status", protect, updateTaskStatus);

// Delete task (Admin only)
router.delete("/:id", protect, isAdmin, deleteTask);

export default router;