import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

/* ==========================================
   MIDDLEWARE
========================================== */

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskflow-1-73qh.onrender.com",
    ],
    credentials: true,
  })
);

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/* ==========================================
   ROOT
========================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow Backend API Running 🚀",
  });
});

/* ==========================================
   API ROUTES
========================================== */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

/* ==========================================
   404
========================================== */

app.use("/*",(req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;