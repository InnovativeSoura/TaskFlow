import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ==========================================
   VERIFY AUTH TOKEN
========================================== */

export const protect = async (req, res, next) => {
  try {

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT configuration missing",
      });
    }


    let token = null;


    /* ==========================================
       CHECK AUTHORIZATION HEADER
    ========================================== */

    const authHeader =
      req.headers.authorization;


    if (
      authHeader &&
      authHeader.toLowerCase().startsWith("bearer ")
    ) {

      token =
        authHeader
          .slice(7)
          .trim();

    }



    /* ==========================================
       CHECK COOKIE TOKEN
    ========================================== */

    if (!token && req.cookies?.token) {

      token =
        req.cookies.token;

    }



    if (!token) {

      return res.status(401).json({

        success:false,

        message:
          "Not authorized, no token provided",

      });

    }



    /* ==========================================
       VERIFY JWT
    ========================================== */

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );



    const userId =
      decoded.id || decoded._id;



    if (!userId) {

      return res.status(401).json({

        success:false,

        message:
          "Invalid token payload",

      });

    }



    /* ==========================================
       FIND USER
    ========================================== */

    const user =
      await User.findById(userId)
        .select("-password");



    if (!user) {

      return res.status(401).json({

        success:false,

        message:
          "User not found",

      });

    }



    /* ==========================================
       ATTACH USER
    ========================================== */

    req.user = user;


    next();



  } catch(error) {


    console.error(
      "Auth Middleware Error:",
      error
    );


    if (
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({

        success:false,

        message:
          "Token expired, please login again",

      });

    }



    if (
      error.name === "JsonWebTokenError"
    ) {

      return res.status(401).json({

        success:false,

        message:
          "Invalid authentication token",

      });

    }



    return res.status(401).json({

      success:false,

      message:
        "Authentication failed",

    });

  }
};

