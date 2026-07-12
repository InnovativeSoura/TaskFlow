import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
} from "../controllers/projectController.js";

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
   PROJECT ROUTES
========================================== */

// =============================
// View Projects (All users)
// =============================

// Get all projects
router.get("/", getProjects);

// Get project by ID
router.get("/:id", getProjectById);

// =============================
// Admin + Manager
// =============================

// Create project
router.post("/", isAdminOrManager, createProject);

// Update project
router.put("/:id", isAdminOrManager, updateProject);

// Add member
router.patch(
  "/:id/add-member",
  isAdminOrManager,
  addMember
);

// =============================
// Admin only
// =============================

// Delete project
router.delete("/:id", isAdmin, deleteProject);

export default router;