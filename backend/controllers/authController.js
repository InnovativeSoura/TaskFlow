import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
  phone: user.phone,
  bio: user.bio,
  isVerified: user.isVerified,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("\n================================");
    console.log("AUTH MIDDLEWARE");
    console.log("Authorization Header:", authHeader ? "Present" : "Missing");
    console.log("================================");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid token.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing.");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ JWT Verified");
    console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User associated with token not found.");

      return res.status(401).json({
        success: false,
        message: "Not authorized. User not found.",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    req.user = user;

    console.log("✅ Authenticated User:", user.email);

    next();
  } catch (error) {
    console.error("❌ AUTH MIDDLEWARE ERROR:");
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized.",
    });
  }
};

export const register = async (req, res) => {
  try {
    let { name, email, password, role = "Team Member" } = req.body;

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

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: formatUser(createdUser),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    console.log("\n================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("================================");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    console.log("Database:", User.db.name);

    const totalUsers = await User.countDocuments();

    console.log("Total Users:", totalUsers);

    const allUsers = await User.find({}).select("name email").lean();

    console.log("========== USERS ==========");
    console.table(allUsers);
    console.log("===========================");

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      console.log("❌ User not found");
      console.log("Searching for:", email);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    console.log("✅ User Found");
    console.log("Mongo ID:", user._id.toString());
    console.log("Mongo Email:", user.email);
    console.log("Stored Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    user.lastLogin = new Date();

    await user.save();

    const token = generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: formatUser(loggedInUser),
    });
  } catch (error) {
    console.error("LOGIN ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
