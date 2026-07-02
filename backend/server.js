import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";


// Connect Database
connectDB();

/* ==========================================
   MIDDLEWARE
========================================== */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskflow-1-73qh.onrender.com",
    ],
    credentials: true,
  })
);

/* ==========================================
   API ROUTES
========================================== */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

/* ==========================================
   ROOT ROUTE
========================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow Backend Running 🚀",
  });
});

/* ==========================================
   404 ROUTE
========================================== */

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ==========================================
   START SERVER
========================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});