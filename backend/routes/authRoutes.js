import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   AUTH ROUTES
========================================== */

/**
 * POST /api/auth/register
 * Register new user
 */
router.post("/register", registerUser);

/**
 * POST /api/auth/login
 * Login user
 */
router.post("/login", loginUser);

/**
 * GET /api/auth/me
 * Get logged-in user profile
 * Protected route
 */
router.get("/me", protect, getMe);

export default router;