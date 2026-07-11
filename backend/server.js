import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";

/* =========================
   CONFIG
========================= */

const PORT = process.env.PORT || 5000;

/* =========================
   HTTP SERVER
========================= */

const server = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
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

/* =========================
   START SERVER
========================= */

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();