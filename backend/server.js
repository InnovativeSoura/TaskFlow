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
   DATABASE
========================= */

connectDB();

const PORT = process.env.PORT || 5000;

/* =========================
   HTTP SERVER
========================= */

const server = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */

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

/* =========================
   START SERVER
========================= */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});