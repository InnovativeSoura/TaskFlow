const express = require("express");
const router = express.Router();

const {
createProject,
getProjects,
addMember,
} = require("../controllers/projectController");

// GET ALL PROJECTS
router.get("/", getProjects);

// CREATE PROJECT
router.post("/", createProject);

// ADD MEMBER TO PROJECT
router.put(
"/:projectId/add-member",
addMember
);

module.exports = router;
