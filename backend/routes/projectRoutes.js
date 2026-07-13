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
   ALL PROJECT ROUTES REQUIRE AUTHENTICATION
========================================== */

router.use(protect);

/* ==========================================
   PROJECT ROUTES
========================================== */

// Get all projects
router.get("/", getProjects);

// Get single project
router.get("/:id", getProjectById);

// Create project (Admin / Manager)
router.post(
  "/",
  isAdminOrManager,
  createProject
);

// Update project (Admin / Manager)
router.put(
  "/:id",
  isAdminOrManager,
  updateProject
);

// Add member (Admin / Manager)
router.patch(
  "/:id/add-member",
  isAdminOrManager,
  addMember
);

// Delete project (Admin only)
router.delete(
  "/:id",
  isAdmin,
  deleteProject
);

export default router;