const express = require("express");

const {
  getMessages,
} = require(
  "../controllers/messageController"
);

const router =
  express.Router();

router.get(
  "/:projectId",
  getMessages
);

module.exports = router;