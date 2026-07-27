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

router.use(protect);

/* ==========================================
   LOGGED-IN USER PROFILE
   IMPORTANT:
   These MUST come before /:id
========================================== */

router.get(
  "/profile",
  getProfile
);

router.put(
  "/profile",
  updateProfile
);

/* ==========================================
   ALL AUTHENTICATED USERS
========================================== */

router.get(
  "/",
  getUsers
);

router.get(
  "/search",
  searchUsers
);

/* ==========================================
   USER DETAILS
========================================== */

router.get(
  "/:id",
  getUserById
);

router.get(
  "/:id/summary",
  getUserSummary
);

/* ==========================================
   ADMIN / MANAGER
========================================== */

router.put(
  "/:id",
  isAdminOrManager,
  updateUser
);

/* ==========================================
   ADMIN ONLY
========================================== */

router.patch(
  "/:id/role",
  isAdmin,
  changeUserRole
);

router.patch(
  "/:id/status",
  isAdmin,
  toggleUserStatus
);

router.delete(
  "/:id",
  isAdmin,
  deleteUser
);

export default router;