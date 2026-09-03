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

import { isAdmin, isAdminOrManager } from "../middleware/permissions.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

router.get("/", getUsers);

router.get("/search", searchUsers);

router.get("/:id", getUserById);

router.get("/:id/summary", getUserSummary);

router.put("/:id", isAdminOrManager, updateUser);

router.patch("/:id/role", isAdmin, changeUserRole);

router.patch("/:id/status", isAdmin, toggleUserStatus);

router.delete("/:id", isAdmin, deleteUser);

export default router;
