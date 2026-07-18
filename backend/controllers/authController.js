import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ======================================================
   FORMAT USER RESPONSE
====================================================== */

const formatUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  designation: user.designation,
  department: user.department,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/* ======================================================
   GENERATE JWT
====================================================== */

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* ======================================================
   REGISTER
====================================================== */

export const register = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
    } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const exists = await User.findOne({
      email,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "Team Member",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: formatUser(user),
    });

  } catch (error) {

    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
/* ======================================================
   LOGIN
====================================================== */

export const login = async (req, res) => {
  try {
    let {
      email,
      password,
    } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    /* ==========================================
       FIND USER
    ========================================== */

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* ==========================================
       VERIFY PASSWORD
       (Uses User model method)
    ========================================== */

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* ==========================================
       UPDATE LAST LOGIN
    ========================================== */

    user.lastLogin = new Date();

    await user.save();

    /* ==========================================
       GENERATE TOKEN
    ========================================== */

    const token = generateToken(user._id);

    /* ==========================================
       RESPONSE
    ========================================== */

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: formatUser(user),
    });

  } catch (error) {

    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
/* ======================================================
   GET CURRENT LOGGED-IN USER
====================================================== */

export const getMe = async (req, res) => {
  try {

    /* ==========================================
       USER SET BY AUTH MIDDLEWARE
    ========================================== */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    /* ==========================================
       FETCH LATEST USER DATA
    ========================================== */

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* ==========================================
       SUCCESS
    ========================================== */

    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });

  } catch (error) {

    console.error("GetMe Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
/* ======================================================
   GET CURRENT LOGGED-IN USER
====================================================== */

export const getMe = async (req, res) => {
  try {

    /* ==========================================
       USER SET BY AUTH MIDDLEWARE
    ========================================== */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    /* ==========================================
       FETCH LATEST USER DATA
    ========================================== */

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* ==========================================
       SUCCESS
    ========================================== */

    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });

  } catch (error) {

    console.error("GetMe Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};