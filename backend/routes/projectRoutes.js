const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  addMember,
} = require("../controllers/projectController");

router.post("/", createProject);

router.get("/", getProjects);

router.put(
  "/:projectId/add-member",
  addMember
);

module.exports = router;