const express = require("express");
const router = express.Router();

const {
  exportTasksPDF,
} = require("../controllers/exportController");

router.get("/tasks/pdf", exportTasksPDF);

module.exports = router;