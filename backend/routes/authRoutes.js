import express from "express";
import passport from "passport";

import {
  register,
  login,
  getMe,
  generateToken,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);

    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  },
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);

    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  },
);

router.get("/me", protect, getMe);

router.get("/verify", protect, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: req.user,
  });
});

router.post("/logout", protect, (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logout successful.",
  });
});

router.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "Authentication",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
