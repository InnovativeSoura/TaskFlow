import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import User from "../models/User.js";

/* ==========================================
   GOOGLE STRATEGY
========================================== */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        `${process.env.API_URL}/api/auth/google/callback`,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error(
              "Google account has no email."
            ),
            null
          );
        }

        let user =
          await User.findOne({
            email,
          });

        if (!user) {
          user =
            await User.create({
              name:
                profile.displayName,

              email,

              password: "",

              avatar:
                profile.photos?.[0]
                  ?.value || "",

              role:
                "Team Member",

              provider:
                "google",

              googleId:
                profile.id,

              isVerified: true,

              lastLogin:
                new Date(),
            });
        } else {
          user.googleId =
            profile.id;

          user.provider =
            "google";

          user.avatar =
            profile.photos?.[0]
              ?.value ||
            user.avatar;

          user.lastLogin =
            new Date();

          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

/* ==========================================
   GITHUB STRATEGY
========================================== */

passport.use(
  new GitHubStrategy(
    {
      clientID:
        process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        `${process.env.API_URL}/api/auth/github/callback`,

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
        const email =
          profile.emails?.[0]
            ?.value ||
          `${profile.username}@github.local`;

        let user =
          await User.findOne({
            email,
          });

        if (!user) {
          user =
            await User.create({
              name:
                profile.displayName ||
                profile.username,

              email,

              password: "",

              avatar:
                profile.photos?.[0]
                  ?.value || "",

              role:
                "Team Member",

              provider:
                "github",

              githubId:
                profile.id,

              isVerified: true,

              lastLogin:
                new Date(),
            });
        } else {
          user.githubId =
            profile.id;

          user.provider =
            "github";

          user.avatar =
            profile.photos?.[0]
              ?.value ||
            user.avatar;

          user.lastLogin =
            new Date();

          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

/* ==========================================
   SERIALIZE
========================================== */

passport.serializeUser(
  (user, done) => {
    done(null, user.id);
  }
);

/* ==========================================
   DESERIALIZE
========================================== */

passport.deserializeUser(
  async (id, done) => {
    try {
      const user =
        await User.findById(id);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

export default passport;