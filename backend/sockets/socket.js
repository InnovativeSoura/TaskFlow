const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
io = new Server(server, {
cors: {
origin: "http://localhost:5173",
methods: ["GET", "POST"],
},
});

io.on("connection", (socket) => {
console.log(
"User Connected:",
socket.id
);


socket.on(
  "join-user",
  (userId) => {
    socket.join(userId);

    console.log(
      `User ${userId} joined room`
    );
  }
);

socket.on(
  "disconnect",
  () => {
    console.log(
      "User Disconnected:",
      socket.id
    );
  }
);

});
};

const getIO = () => io;

module.exports = {
initializeSocket,
getIO,
};
