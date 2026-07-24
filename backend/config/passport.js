import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import User from "../models/User.js";

/* ======================================================
   CALLBACK URL
====================================================== */

const API_URL = process.env.API_URL?.replace(/\/$/, "");

/* ======================================================
   GOOGLE STRATEGY
====================================================== */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${API_URL}/api/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(
            new Error("Google account has no email."),
            null
          );
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,

            password: "",

            avatar:
              profile.photos?.[0]?.value || "",

            provider: "google",

            googleId: profile.id,

            role: "Team Member",

            isVerified: true,

            lastLogin: new Date(),
          });
        } else {
          user.provider = "google";

          user.googleId = profile.id;

          if (profile.photos?.length) {
            user.avatar =
              profile.photos[0].value;
          }

          user.lastLogin = new Date();

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
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
      clientID: process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,

      callbackURL: `${API_URL}/api/auth/github/callback`,

      scope: ["user:email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value?.toLowerCase() ||
          `${profile.username}@github.local`;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name:
              profile.displayName ||
              profile.username,

            email,

            password: "",

            avatar:
              profile.photos?.[0]?.value || "",

            provider: "github",

            githubId: profile.id,

            role: "Team Member",

            isVerified: true,

            lastLogin: new Date(),
          });
        } else {
          user.provider = "github";

          user.githubId = profile.id;

          if (profile.photos?.length) {
            user.avatar =
              profile.photos[0].value;
          }

          user.lastLogin = new Date();

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* ======================================================
   SERIALIZE
====================================================== */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

/* ======================================================
   DESERIALIZE
====================================================== */

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
console.log("================================");
console.log("Passport initialized");
console.log(
  "Google Client:",
  process.env.GOOGLE_CLIENT_ID ? "OK" : "Missing"
);
console.log(
  "Github Client:",
  process.env.GITHUB_CLIENT_ID ? "OK" : "Missing"
);
console.log("================================");

export default passport;