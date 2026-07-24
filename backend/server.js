// backend/server.js

import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

/* ======================================================
   FIX MONGODB DNS
====================================================== */

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";

/* ======================================================
   PORT
====================================================== */

const PORT = process.env.PORT || 5000;

/* ======================================================
   HTTP SERVER
====================================================== */

const server = http.createServer(app);

/* ======================================================
   ALLOWED CLIENTS
====================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
  process.env.CLIENT_API_URL,
].filter(Boolean);

/* ======================================================
   SOCKET.IO
====================================================== */

export const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Socket Blocked Origin:", origin);

      callback(new Error("Socket CORS Error"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
  },
});

/* ======================================================
   SOCKET EVENTS
====================================================== */

io.on("connection", (socket) => {
  console.log(`✅ Socket Connected : ${socket.id}`);

  socket.on("join-user", (userId) => {
    socket.join(userId);

    console.log(`👤 ${userId} joined`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket Disconnected : ${socket.id}`);
  });
});

/* ======================================================
   START SERVER
====================================================== */

const startServer = async () => {
  try {
    console.log("");
    console.log("=======================================");
    console.log("🚀 Starting TaskFlow Backend...");
    console.log("=======================================");

    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log("");
      console.log("=======================================");
      console.log("✅ TaskFlow Backend Running");
      console.log("=======================================");
      console.log(
        "🌍 Environment :",
        process.env.NODE_ENV || "development"
      );
      console.log(
        "📡 Port        :",
        PORT
      );
      console.log(
        "🖥 Client URL  :",
        process.env.CLIENT_URL
      );
      console.log(
        "🌐 API URL     :",
        process.env.API_URL || `http://localhost:${PORT}`
      );
      console.log("=======================================");
      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("=======================================");
    console.error("❌ SERVER START FAILED");
    console.error("=======================================");
    console.error(error);
    console.error("=======================================");
    console.error("");

    process.exit(1);
  }
};

startServer();