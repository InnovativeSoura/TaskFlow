import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import app from "./app.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

/* ==========================================
   CONNECT DATABASE
========================================== */

connectDB();

/* ==========================================
   PORT
========================================== */

const PORT = process.env.PORT || 5000;

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
   404 HANDLER
========================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ==========================================
   HTTP SERVER
========================================== */

const server = http.createServer(app);

/* ==========================================
   SOCKET.IO
========================================== */

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://taskflow-1-73qh.onrender.com",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

/* ==========================================
   START SERVER
========================================== */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});