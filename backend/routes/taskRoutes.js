import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
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

// Everyone can view
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Only Admin & Manager
router.post("/", isAdminOrManager, createProject);
router.put("/:id", isAdminOrManager, updateProject);
router.patch("/:id/add-member", isAdminOrManager, addMember);

// Admin only
router.delete("/:id", isAdmin, deleteProject);

export default router;