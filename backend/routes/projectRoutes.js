const express = require("express");
const router = express.Router();

const {
  getProjects,
  addMember,
} = require("../controllers/projectController");

router.get("/", getProjects);

router.put(
  "/:projectId/add-member",
  addMember
);

module.exports = router;