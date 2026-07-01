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
import { isAdmin, isAdminOrManager } from "../middleware/permissions.js";

const router = express.Router();

/* ==========================================
   GLOBAL PROTECTION
========================================== */
router.use(protect);

/* ==========================================
   PROJECT ROUTES
========================================== */

// Create project (Admin + Manager)
router.post("/", isAdminOrManager, createProject);

// Get all projects
router.get("/", isAdminOrManager, getProjects);

// Get single project
router.get("/:id", isAdminOrManager, getProjectById);

// Update project
router.put("/:id", isAdminOrManager, updateProject);

// Add member to project
router.patch("/:id/add-member", isAdminOrManager, addMember);

// Delete project (Admin only)
router.delete("/:id", isAdmin, deleteProject);

export default router;