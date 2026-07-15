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


/* ==========================================
   AUTH ROUTES
   Base URL:
   /api/auth
========================================== */


/*
  POST /api/auth/register
  Create new account
*/
router.post(
  "/register",
  register
);


/*
  POST /api/auth/login
  Login user
*/
router.post(
  "/login",
  login
);


/*
  GET /api/auth/me
  Get logged-in user profile
  Protected route
*/
router.get(
  "/me",
  protect,
  getMe
);


export default router;

