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

router.use(protect);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.post("/", isAdminOrManager, createProject);

router.put("/:id", isAdminOrManager, updateProject);

router.patch("/:id/add-member", isAdminOrManager, addMember);

router.delete("/:id", isAdmin, deleteProject);

export default router;
