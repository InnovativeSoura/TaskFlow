import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const oauthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }

    /* Update Last Login */

    await User.findByIdAndUpdate(req.user._id, {
      lastLogin: new Date(),
    });

    const token = generateToken(req.user);

    return res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${encodeURIComponent(
        token,
      )}`,
    );
  } catch (error) {
    console.error("OAuth Error:", error);

    return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};
