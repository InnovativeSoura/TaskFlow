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

/* ==========================================
   USER ACCESS ROUTES
========================================== */

router.get("/", isAdminOrManager, getUsers);

router.get("/search", isAdminOrManager, searchUsers);

router.get("/:id", isAdminOrManager, getUserById);

router.get("/:id/summary", isAdminOrManager, getUserSummary);

router.put("/:id", isAdminOrManager, updateUser);

/* ==========================================
   ADMIN ONLY ACTIONS
========================================== */

router.delete("/:id", isAdmin, deleteUser);

router.patch("/:id/role", isAdmin, changeUserRole);

router.patch("/:id/toggle-status", isAdmin, toggleUserStatus);

export default router;