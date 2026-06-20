const express = require("express");

const {
  createWorkspace,
  getWorkspaces,
  addMember,
} = require("../controllers/workspaceController");

const router = express.Router();

router.post("/", createWorkspace);
router.get("/", getWorkspaces);
router.post("/add-member", addMember);

module.exports = router;