const express = require("express");
const router = express.Router();

const {
  addMember,
} = require("../controllers/projectController");

router.put(
  "/:projectId/add-member",
  addMember
);

module.exports = router;