import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://taskflow-1-73qh.onrender.com",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },

    // Support both polling and websocket
    transports: ["polling", "websocket"],

    // Helps keep Render connections alive
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    // Join user's private room
    socket.on("join-user", (userId) => {
      if (!userId) return;

      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    // Optional: Log socket errors
    socket.on("error", (err) => {
      console.error("❌ Socket Error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ User Disconnected: ${socket.id}`);
      console.log(`Reason: ${reason}`);
    });
  });

  // Log server-level connection errors
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