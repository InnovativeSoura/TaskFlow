import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

/* ==========================================
   TRUST PROXY (Required for Render)
========================================== */

app.set("trust proxy", 1);

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
  origin(origin, callback) {
    // Allow Postman / curl / server-side requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked Origin:", origin);

    return callback(new Error("Not allowed by CORS"));
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

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

/* ==========================================
   BODY PARSER
========================================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ==========================================
   OTHER MIDDLEWARE
========================================== */

app.use(cookieParser());

app.use(compression());

app.use(morgan("dev"));

/* ==========================================
   ROOT
========================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow Backend Running 🚀",
  });
});

/* ==========================================
   HEALTH CHECK
========================================== */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================
   API ROUTES
========================================== */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/settings", settingsRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

/* ==========================================
   404
========================================== */

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found : ${req.method} ${req.originalUrl}`,
  });
});

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use((err, req, res, next) => {
  console.error("Server Error");
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

/* ==========================================
   STARTUP LOG
========================================== */

console.log("========================================");
console.log("TaskFlow Express Initialized");
console.log("Allowed Origins:");
console.log(allowedOrigins);
console.log("========================================");

export default app;