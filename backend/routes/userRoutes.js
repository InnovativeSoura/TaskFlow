import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  toggleUserStatus,
  searchUsers,
  getUserSummary,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrManager } from "../middleware/permissions.js";

const router = express.Router();

/* ==========================================
   PROTECTED USER ROUTES
========================================== */

router.use(protect);

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