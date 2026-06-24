const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");


router.post("/", protect, createTask);
router.post("/", protect, createProject);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;