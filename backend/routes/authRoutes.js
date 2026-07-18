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
   POST /api/auth/register
====================================================== */

router.post(
  "/register",
  register
);

/* ======================================================
   LOGIN
   POST /api/auth/login
====================================================== */

router.post(
  "/login",
  login
);

/* ======================================================
   CURRENT USER
   GET /api/auth/me
====================================================== */

router.get(
  "/me",
  protect,
  getMe
);

/* ======================================================
   VERIFY TOKEN
   GET /api/auth/verify
====================================================== */

router.get(
  "/verify",
  protect,
  (req, res) => {
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: req.user,
    });
  }
);

/* ======================================================
   LOGOUT
   POST /api/auth/logout
====================================================== */

router.post(
  "/logout",
  protect,
  (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "None"
          : "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  }
);

/* ======================================================
   HEALTH CHECK
   GET /api/auth/status
====================================================== */

router.get(
  "/status",
  (req, res) => {
    return res.status(200).json({
      success: true,
      service: "Authentication",
      status: "Running",
      timestamp: new Date().toISOString(),
    });
  }
);

export default router;