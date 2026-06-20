import { io } from "socket.io-client";

// Backend URL
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

// Create socket connection
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection Events
socket.on("connect", () => {
  console.log(
    "✅ Socket Connected:",
    socket.id
  );
});

socket.on("disconnect", () => {
  console.log(
    "❌ Socket Disconnected"
  );
});

socket.on("connect_error", (error) => {
  console.error(
    "Socket Connection Error:",
    error.message
  );
});

export default socket;