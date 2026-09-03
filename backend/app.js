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

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const allowedOrigins = [
  "http://localhost:5173",

  "http://127.0.0.1:5173",

  process.env.CLIENT_URL,

  process.env.CLIENT_API_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
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

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET || "taskflow-session-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === "production",

      httpOnly: true,

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use(passport.initialize());

app.use(passport.session());

app.use(compression());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "TaskFlow Backend Running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/auth", oauthRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route Not Found : ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:");

  console.error(err);

  return res.status(err.status || 500).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

console.log("========================================");

console.log("TaskFlow Express Initialized");

console.log("Allowed Origins:");

console.log(allowedOrigins);

console.log("========================================");

export default app;
