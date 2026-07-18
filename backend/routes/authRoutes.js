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

/*
   POST
   /api/auth/register
*/
router.post(
  "/register",
  register
);

/*
   POST
   /api/auth/login
*/
router.post(
  "/login",
  login
);

/*
   GET
   /api/auth/me
*/
router.get(
  "/me",
  protect,
  getMe
);

/*
   POST
   /api/auth/logout
*/
router.post(
  "/logout",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
);

/*
   GET
   /api/auth/verify
   Used by frontend to verify JWT
*/
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

export default router;