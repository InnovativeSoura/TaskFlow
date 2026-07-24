// backend/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ======================================================
   PROTECT ROUTE
====================================================== */

export const protect = async (req, res, next) => {
  try {
    let token;

    /* ------------------------------------------
       Authorization Header
    ------------------------------------------ */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    /* ------------------------------------------
       Cookie Fallback
    ------------------------------------------ */

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    /* ------------------------------------------
       No Token
    ------------------------------------------ */

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided.",
      });
    }

    /* ------------------------------------------
       Verify JWT
    ------------------------------------------ */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* ------------------------------------------
       Find User
    ------------------------------------------ */

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive.",
      });
    }

    req.user = user;

    return next();
  } catch (err) {
    console.error("AUTH ERROR");
    console.error(err);

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
      message: "Admin access required.",
    });
  }

  return next();
};

/* ======================================================
   PROJECT MANAGER / ADMIN
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
    "Project Manager",
  ];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  return next();
};