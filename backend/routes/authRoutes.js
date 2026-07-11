import express from "express";
import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   AUTH ROUTES
========================================== */

// POST /api/auth/register
// Register new user
router.post("/register", register);

// POST /api/auth/login
// Login user
router.post("/login", login);

// GET /api/auth/me
// Get logged-in user profile
router.get("/me", protect, getMe);

export default router;