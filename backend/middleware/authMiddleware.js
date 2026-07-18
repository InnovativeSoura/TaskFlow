import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ======================================================
   PROTECT ROUTE
====================================================== */

export const protect = async (req, res, next) => {
  try {

    /* ==========================================
       JWT SECRET CHECK
    ========================================== */

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing.",
      });
    }

    let token = null;

    /* ==========================================
       READ AUTHORIZATION HEADER
       Authorization: Bearer xxxxx
    ========================================== */

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    /* ==========================================
       READ COOKIE TOKEN (OPTIONAL)
    ========================================== */

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    /* ==========================================
       TOKEN NOT FOUND
    ========================================== */

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided.",
      });
    }

    /* ==========================================
       VERIFY TOKEN
    ========================================== */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* ==========================================
       FIND USER
    ========================================== */

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    /* ==========================================
       USER STATUS CHECK
    ========================================== */

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive.",
      });
    }

    /* ==========================================
       ATTACH USER
    ========================================== */

    req.user = user;

    next();

  } catch (error) {

    console.error("Auth Middleware Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });

  }
};

/* ======================================================
   ADMIN ONLY
====================================================== */

export const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();

};

/* ======================================================
   MANAGER OR ADMIN
====================================================== */

export const managerOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const allowedRoles = [
    "Admin",
    "Manager",
    "Project Manager",
  ];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();

};
