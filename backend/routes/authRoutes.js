// backend/routes/authRoutes.js

import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   AUTH ROUTES
   Base URL: /api/auth
====================================================== */

/* ======================================================
   REGISTER
====================================================== */

router.post("/register", register);

/* ======================================================
   LOGIN
====================================================== */

router.post("/login", login);

/* ======================================================
   CURRENT USER
====================================================== */

router.get("/me", protect, getMe);

/* ======================================================
   VERIFY TOKEN
====================================================== */

router.get("/verify", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    user: req.user,
  });
});

/* ======================================================
   LOGOUT
====================================================== */

router.post("/logout", protect, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

/* ======================================================
   STATUS
====================================================== */

router.get("/status", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Authentication",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

export default router;