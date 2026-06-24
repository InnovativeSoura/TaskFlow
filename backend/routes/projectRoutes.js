const express = require("express");
const router = express.Router();

const {
createProject,
getProjects,
addMember,
} = require("../controllers/projectController");

router.get("/", getProjects);

router.post("/", createProject);

router.put(
"/:projectId/add-member",
addMember
);

module.exports = router;
