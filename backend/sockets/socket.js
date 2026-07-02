import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://taskflow-1-73qh.onrender.com",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join-user", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;