import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://taskflow-1-73qh.onrender.com"],
      methods: ["GET", "POST"],
      credentials: true,
    },

    transports: ["polling", "websocket"],

    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    socket.on("join-user", (userId) => {
      if (!userId) return;

      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket Error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ User Disconnected: ${socket.id}`);
      console.log(`Reason: ${reason}`);
    });
  });

  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO Connection Error:");
    console.error("Code:", err.code);
    console.error("Message:", err.message);
    console.error("Context:", err.context);
  });

  console.log("🚀 Socket.IO Server Initialized");
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};
