// backend/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

/* ==========================================
   TRUST PROXY
   Required for Render
========================================== */

app.set(
  "trust proxy",
  1
);

/* ==========================================
   SECURITY
========================================== */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ==========================================
   ALLOWED ORIGINS
========================================== */

const allowedOrigins = [
  "http://localhost:5173",

  "http://127.0.0.1:5173",

  process.env.CLIENT_URL,

  process.env.CLIENT_API_URL,
].filter(Boolean);

/* ==========================================
   CORS
========================================== */

const corsOptions = {
  origin: (
    origin,
    callback
  ) => {
    /*
      Allow requests without
      an Origin header, such as
      server-to-server requests.
    */

    if (!origin) {
      return callback(
        null,
        true
      );
    }

    if (
      allowedOrigins.includes(
        origin
      )
    ) {
      return callback(
        null,
        true
      );
    }

    console.log(
      "Blocked Origin:",
      origin
    );

    return callback(
      new Error(
        "Not allowed by CORS"
      )
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(
  cors(corsOptions)
);

app.options(
  "*",
  cors(corsOptions)
);

/* ==========================================
   BODY PARSER
========================================== */

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/* ==========================================
   COOKIE PARSER
========================================== */

app.use(
  cookieParser()
);

/* ==========================================
   EXPRESS SESSION
========================================== */

app.use(
  session({
    secret:
      process.env.JWT_SECRET ||
      "taskflow-session-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure:
        process.env.NODE_ENV ===
        "production",

      httpOnly: true,

      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",

      maxAge:
        1000 *
        60 *
        60 *
        24 *
        7,
    },
  })
);

/* ==========================================
   PASSPORT
========================================== */

app.use(
  passport.initialize()
);

app.use(
  passport.session()
);

/* ==========================================
   OTHER MIDDLEWARE
========================================== */

app.use(
  compression()
);

app.use(
  morgan("dev")
);

/* ==========================================
   ROOT
========================================== */

app.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "TaskFlow Backend Running 🚀",
    });
  }
);

/* ==========================================
   HEALTH CHECK
========================================== */

app.get(
  "/api/health",
  (req, res) => {
    return res.status(200).json({
      success: true,
      status: "OK",
      environment:
        process.env.NODE_ENV ||
        "development",
      uptime:
        process.uptime(),
      timestamp:
        new Date().toISOString(),
    });
  }
);

/* ==========================================
   AUTH
========================================== */

app.use(
  "/api/auth",
  authRoutes
);

/* ==========================================
   OAUTH
========================================== */

app.use(
  "/api/auth",
  oauthRoutes
);

/* ==========================================
   USERS
========================================== */

app.use(
  "/api/users",
  userRoutes
);

/* ==========================================
   DASHBOARD
========================================== */

app.use(
  "/api/dashboard",
  dashboardRoutes
);

/* ==========================================
   PROJECTS
========================================== */

app.use(
  "/api/projects",
  projectRoutes
);

/* ==========================================
   TASKS
========================================== */

app.use(
  "/api/tasks",
  taskRoutes
);

/* ==========================================
   SETTINGS
========================================== */

app.use(
  "/api/settings",
  settingsRoutes
);

/* ==========================================
   NOTIFICATIONS
========================================== */

app.use(
  "/api/notifications",
  notificationRoutes
);

/* ==========================================
   404
========================================== */

app.use(
  "*",
  (req, res) => {
    return res.status(404).json({
      success: false,
      message:
        `Route Not Found : ${req.method} ${req.originalUrl}`,
    });
  }
);

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "Server Error:"
    );

    console.error(err);

    return res
      .status(
        err.status || 500
      )
      .json({
        success: false,

        message:
          process.env.NODE_ENV ===
          "production"
            ? "Internal Server Error"
            : err.message,
      });
  }
);

/* ==========================================
   STARTUP LOG
========================================== */

console.log(
  "========================================"
);

console.log(
  "TaskFlow Express Initialized"
);

console.log(
  "Allowed Origins:"
);

console.log(
  allowedOrigins
);

console.log(
  "========================================"
);

export default app;