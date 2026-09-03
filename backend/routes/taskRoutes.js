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

router.use(protect);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.post("/", isAdminOrManager, createTask);

router.put("/:id", isAdminOrManager, updateTask);

router.patch("/:id/status", updateTaskStatus);

router.delete("/:id", isAdmin, deleteTask);

export default router;
