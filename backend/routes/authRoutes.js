import express from "express";
import passport from "passport";

import {
  register,
  login,
  getMe,
  generateToken,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   REGISTER
====================================================== */

router.post("/register", register);

/* ======================================================
   LOGIN
====================================================== */

router.post("/login", login);

/* ======================================================
   GOOGLE LOGIN
====================================================== */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/* ======================================================
   GOOGLE CALLBACK
====================================================== */

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  }
);

/* ======================================================
   GITHUB LOGIN
====================================================== */

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

/* ======================================================
   GITHUB CALLBACK
====================================================== */

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  }
);

/* ======================================================
   CURRENT USER
====================================================== */

router.get("/me", protect, getMe);

/* ======================================================
   VERIFY TOKEN
====================================================== */

router.get("/verify", protect, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: req.user,
  });
});

/* ======================================================
   LOGOUT
====================================================== */

router.post("/logout", protect, (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logout successful.",
  });
});

/* ======================================================
   STATUS
====================================================== */

router.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "Authentication",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

export default router;