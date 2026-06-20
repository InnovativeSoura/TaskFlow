const express = require("express");

const {
  generateSummary,
} = require(
  "../controllers/aiController"
);

const router =
  express.Router();

router.post(
  "/summary",
  generateSummary
);

module.exports =
  router;