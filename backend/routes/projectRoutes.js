const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  projectStats,
} = require("../controllers/projectController");

// Create Project
router.post("/", createProject);

// Get All Projects
router.get("/", getProjects);

// Dashboard Statistics
router.get("/stats", projectStats);

// Get Single Project
router.get("/:id", getProject);

// Update Project
router.put("/:id", updateProject);

// Delete Project
router.delete("/:id", deleteProject);

module.exports = router;