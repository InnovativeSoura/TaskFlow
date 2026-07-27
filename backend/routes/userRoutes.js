// backend/routes/userRoutes.js

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
========================================== */

/*
   IMPORTANT:
   These routes must appear BEFORE /:id
   because "profile" would otherwise be
   interpreted as an ID.
*/

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
   USER BY ID
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
   ADMIN & MANAGER
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