const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "Socket Connected:",
      socket.id
    );

    socket.on("disconnect", () => {
      console.log(
        "Socket Disconnected:",
        socket.id
      );
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};