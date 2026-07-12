import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
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

// All routes require login
router.use(protect);

/* ==========================================
   PROFILE ROUTES
========================================== */

// Logged-in user profile
router.get("/profile", getProfile);

// Update own profile
router.put("/profile", updateProfile);

/* ==========================================
   USER ROUTES
========================================== */

// All authenticated users can view users
router.get("/", getUsers);

// Get single user
router.get("/:id", getUserById);

// Admin & Manager can update users
router.put("/:id", isAdminOrManager, updateUser);

// Only Admin can delete users
router.delete("/:id", isAdmin, deleteUser);

export default router;