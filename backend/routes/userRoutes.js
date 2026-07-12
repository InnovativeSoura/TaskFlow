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
import {
  isAdmin,
  isAdminOrManager,
} from "../middleware/permissions.js";

const router = express.Router();

/* ==========================================
   AUTHENTICATION
========================================== */

router.use(protect);

/* ==========================================
   USER ROUTES
========================================== */

// All authenticated users
router.get("/", getUsers);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.get("/:id/summary", getUserSummary);

// Admin & Manager
router.put("/:id", isAdminOrManager, updateUser);
router.patch("/:id/role", isAdmin, changeUserRole);
router.patch("/:id/status", isAdmin, toggleUserStatus);

// Admin only
router.delete("/:id", isAdmin, deleteUser);

export default router;