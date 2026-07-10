import { io } from "socket.io-client";

const SERVER_URL = (
  import.meta.env.CLIENT_API_URL || "http://localhost:5000/api"
).replace("/api", "");

const socket = io(SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
});


socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("⚠️ Socket Error:", err.message);
});

export default socket;