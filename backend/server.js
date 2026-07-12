import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

/* ==========================================
   FIX MONGODB DNS
========================================== */

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

/* ==========================================
   CREATE HTTP SERVER
========================================== */

const server = http.createServer(app);

/* ==========================================
   ALLOWED ORIGINS
========================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

/* ==========================================
   SOCKET.IO
========================================== */

export const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

/* ==========================================
   SOCKET EVENTS
========================================== */

io.on("connection", (socket) => {
  console.log(`✅ Socket Connected: ${socket.id}`);

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`👤 User Joined: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket Disconnected: ${socket.id}`);
  });
});

/* ==========================================
   START SERVER
========================================== */

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log("=======================================");
      console.log("🚀 TaskFlow Backend Started");
      console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 Port        : ${PORT}`);
      console.log(`🌐 Client URL  : ${process.env.CLIENT_URL}`);
      console.log("=======================================");
    });
  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();