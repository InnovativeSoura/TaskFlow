// backend/config/passport.js

import passport from "passport";
import crypto from "crypto";

import {
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";

import {
  Strategy as GitHubStrategy,
} from "passport-github2";

import User from "../models/User.js";

/* ======================================================
   ENVIRONMENT / CALLBACK URL
====================================================== */

const API_URL = (
  process.env.API_URL ||
  ""
).replace(/\/+$/, "");

const CLIENT_URL = (
  process.env.CLIENT_URL ||
  ""
).replace(/\/+$/, "");

/* ======================================================
   DEBUG CONFIGURATION
====================================================== */

console.log("");
console.log("========================================");
console.log("🔐 TaskFlow Passport Configuration");
console.log("========================================");

console.log(
  "🌐 API URL:",
  API_URL || "Missing"
);

console.log(
  "🖥 Client URL:",
  CLIENT_URL || "Missing"
);

console.log(
  "🔵 Google Client:",
  process.env.GOOGLE_CLIENT_ID
    ? "OK"
    : "Missing"
);

console.log(
  "⚫ GitHub Client:",
  process.env.GITHUB_CLIENT_ID
    ? "OK"
    : "Missing"
);

console.log(
  "🔑 Google Secret:",
  process.env.GOOGLE_CLIENT_SECRET
    ? "OK"
    : "Missing"
);

console.log(
  "🔑 GitHub Secret:",
  process.env.GITHUB_CLIENT_SECRET
    ? "OK"
    : "Missing"
);

console.log(
  "🔗 Google Callback:",
  `${API_URL}/api/auth/google/callback`
);

console.log(
  "🔗 GitHub Callback:",
  `${API_URL}/api/auth/github/callback`
);

console.log("========================================");
console.log("");

/* ======================================================
   VALIDATE OAUTH CONFIGURATION
====================================================== */

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn(
    "⚠️ GOOGLE_CLIENT_ID is missing."
  );
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "⚠️ GOOGLE_CLIENT_SECRET is missing."
  );
}

if (!process.env.GITHUB_CLIENT_ID) {
  console.warn(
    "⚠️ GITHUB_CLIENT_ID is missing."
  );
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  console.warn(
    "⚠️ GITHUB_CLIENT_SECRET is missing."
  );
}

if (!API_URL) {
  console.warn(
    "⚠️ API_URL is missing."
  );
}

/* ======================================================
   GENERATE INTERNAL PASSWORD
====================================================== */

/*
   OAuth users don't authenticate using this password.

   However, many User schemas require a password field.
   Therefore, we generate a strong random password.

   IMPORTANT:
   We intentionally pass the plain random value to
   Mongoose. If User.js has a pre-save bcrypt hook,
   the hook can hash it normally.
*/

const generateOAuthPassword = () => {
  return crypto
    .randomBytes(32)
    .toString("hex");
};

/* ======================================================
   GOOGLE STRATEGY
====================================================== */

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        `${API_URL}/api/auth/google/callback`,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        console.log("");
        console.log(
          "========================================"
        );
        console.log(
          "🔵 GOOGLE OAUTH CALLBACK"
        );
        console.log(
          "Google ID:",
          profile.id
        );
        console.log(
          "Google Name:",
          profile.displayName
        );
        console.log(
          "========================================"
        );

        /* ==========================================
           GET EMAIL
        ========================================== */

        const email =
          profile.emails?.[0]?.value
            ?.trim()
            .toLowerCase();

        if (!email) {
          console.error(
            "❌ Google account has no email."
          );

          return done(
            new Error(
              "Google account has no email."
            ),
            null
          );
        }

        /* ==========================================
           FIND EXISTING USER
        ========================================== */

        let user =
          await User.findOne({
            $or: [
              {
                googleId: profile.id,
              },
              {
                email,
              },
            ],
          });

        /* ==========================================
           CREATE NEW USER
        ========================================== */

        if (!user) {
          console.log(
            "🆕 Creating Google user:",
            email
          );

          user =
            await User.create({
              name:
                profile.displayName ||
                email.split("@")[0],

              email,

              password:
                generateOAuthPassword(),

              avatar:
                profile.photos?.[0]?.value ||
                "",

              provider: "google",

              googleId:
                profile.id,

              role: "Team Member",

              isVerified: true,

              lastLogin:
                new Date(),
            });

          console.log(
            "✅ Google user created:",
            user._id.toString()
          );
        } else {
          /* ========================================
             UPDATE EXISTING USER
          ======================================== */

          console.log(
            "♻️ Existing user found:",
            user.email
          );

          user.provider = "google";

          user.googleId =
            profile.id;

          if (
            profile.photos?.length
          ) {
            user.avatar =
              profile.photos[0].value;
          }

          user.isVerified = true;

          user.lastLogin =
            new Date();

          await user.save();

          console.log(
            "✅ Google user updated:",
            user._id.toString()
          );
        }

        return done(null, user);
      } catch (error) {
        console.error("");
        console.error(
          "========================================"
        );
        console.error(
          "❌ GOOGLE PASSPORT ERROR"
        );
        console.error(
          "========================================"
        );
        console.error(
          error
        );
        console.error(
          "========================================"
        );
        console.error("");

        return done(
          error,
          null
        );
      }
    }
  )
);

/* ======================================================
   GITHUB STRATEGY
====================================================== */

passport.use(
  new GitHubStrategy(
    {
      clientID:
        process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        `${API_URL}/api/auth/github/callback`,

      scope: [
        "user:email",
      ],
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        console.log("");
        console.log(
          "========================================"
        );
        console.log(
          "⚫ GITHUB OAUTH CALLBACK"
        );
        console.log(
          "GitHub ID:",
          profile.id
        );
        console.log(
          "GitHub Username:",
          profile.username
        );
        console.log(
          "GitHub Name:",
          profile.displayName
        );
        console.log(
          "========================================"
        );

        /* ==========================================
           GET EMAIL
        ========================================== */

        const email =
          profile.emails?.[0]?.value
            ?.trim()
            .toLowerCase() ||
          `${profile.username}@github.local`;

        /* ==========================================
           FIND EXISTING USER
        ========================================== */

        let user =
          await User.findOne({
            $or: [
              {
                githubId: profile.id,
              },
              {
                email,
              },
            ],
          });

        /* ==========================================
           CREATE NEW USER
        ========================================== */

        if (!user) {
          console.log(
            "🆕 Creating GitHub user:",
            email
          );

          user =
            await User.create({
              name:
                profile.displayName ||
                profile.username ||
                email.split("@")[0],

              email,

              password:
                generateOAuthPassword(),

              avatar:
                profile.photos?.[0]?.value ||
                "",

              provider: "github",

              githubId:
                profile.id,

              role: "Team Member",

              isVerified: true,

              lastLogin:
                new Date(),
            });

          console.log(
            "✅ GitHub user created:",
            user._id.toString()
          );
        } else {
          /* ========================================
             UPDATE EXISTING USER
          ======================================== */

          console.log(
            "♻️ Existing user found:",
            user.email
          );

          user.provider = "github";

          user.githubId =
            profile.id;

          if (
            profile.photos?.length
          ) {
            user.avatar =
              profile.photos[0].value;
          }

          user.isVerified = true;

          user.lastLogin =
            new Date();

          await user.save();

          console.log(
            "✅ GitHub user updated:",
            user._id.toString()
          );
        }

        return done(null, user);
      } catch (error) {
        console.error("");
        console.error(
          "========================================"
        );
        console.error(
          "❌ GITHUB PASSPORT ERROR"
        );
        console.error(
          "========================================"
        );
        console.error(
          error
        );
        console.error(
          "========================================"
        );
        console.error("");

        return done(
          error,
          null
        );
      }
    }
  )
);

/* ======================================================
   SERIALIZE USER
====================================================== */

passport.serializeUser(
  (user, done) => {
    try {
      done(
        null,
        user._id.toString()
      );
    } catch (error) {
      done(error, null);
    }
  }
);

/* ======================================================
   DESERIALIZE USER
====================================================== */

passport.deserializeUser(
  async (id, done) => {
    try {
      const user =
        await User.findById(id);

      if (!user) {
        return done(
          null,
          false
        );
      }

      done(
        null,
        user
      );
    } catch (error) {
      done(
        error,
        null
      );
    }
  }
);

/* ======================================================
   PASSPORT READY
====================================================== */

console.log(
  "✅ Passport Google strategy registered."
);

console.log(
  "✅ Passport GitHub strategy registered."
);

export default passport;