import express from "express";
import passport from "../config/passport.js";

import {
  oauthSuccess,
} from "../controllers/oauthController.js";

const router =
  express.Router();

/* ==========================================
   GOOGLE LOGIN
========================================== */

router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],
      session: false,
    }
  )
);

/* ==========================================
   GOOGLE CALLBACK
========================================== */

router.get(
  "/google/callback",

  passport.authenticate(
    "google",
    {
      session: false,

      failureRedirect:
        `${process.env.CLIENT_URL}/login`,
    }
  ),

  oauthSuccess
);

/* ==========================================
   GITHUB LOGIN
========================================== */

router.get(
  "/github",
  passport.authenticate(
    "github",
    {
      scope: [
        "user:email",
      ],

      session: false,
    }
  )
);

/* ==========================================
   GITHUB CALLBACK
========================================== */

router.get(
  "/github/callback",

  passport.authenticate(
    "github",
    {
      session: false,

      failureRedirect:
        `${process.env.CLIENT_URL}/login`,
    }
  ),

  oauthSuccess
);

export default router;