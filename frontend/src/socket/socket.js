import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CLEAN_API_URL = API_URL.replace(/\/+$/, "");

const SERVER_URL = CLEAN_API_URL.replace(/\/api$/, "");

console.log("====================================");
console.log("🔌 TaskFlow Socket Configuration");
console.log("====================================");
console.log("🌐 API URL:", API_URL);
console.log("🔌 Socket URL:", SERVER_URL);
console.log("====================================");

const socket = io(SERVER_URL, {
  transports: ["websocket"],

  withCredentials: true,

  reconnection: true,

  nectionAttempts: Infinity,

  reconnectionDelay: 1000,

  reconnectionDelayMax: 5000,

  randomizationFactor: 0.5,

  timeout: 20000,

  autoConnect: true,
});

socket.on("connect", () => {
  console.log("====================================");

  console.log("✅ Socket Connected:", socket.id);

  console.log("🌐 Socket Server:", SERVER_URL);

  console.log("====================================");
});

socket.on("connect_error", (error) => {
  console.warn("⚠️ Socket Connection Error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket Disconnected:", reason);
});

socket.io.on("reconnect_attempt", (attempt) => {
  console.log(`🔄 Socket Reconnect Attempt #${attempt}`);
});

socket.io.on("reconnect", (attempt) => {
  console.log(`✅ Socket Reconnected After ${attempt} Attempt(s)`);

  console.log("🆔 New Socket ID:", socket.id);
});

socket.io.on("reconnect_error", (error) => {
  console.warn("⚠️ Socket Reconnect Error:", error.message);
});

socket.io.on("reconnect_failed", () => {
  console.error("❌ Socket Reconnection Failed");
});

const handlePageHide = () => {
  if (socket.connected) {
    console.log("📦 Page hidden - closing Socket.IO connection");

    socket.disconnect();
  }
};

window.addEventListener("pagehide", handlePageHide);

const handlePageShow = (event) => {
  if (event.persisted) {
    console.log("♻️ Page restored from Back-Forward Cache");

    if (!socket.connected) {
      console.log("🔄 Reconnecting Socket.IO...");

      socket.connect();
    }
  }
};

window.addEventListener("pageshow", handlePageShow);

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    console.log("👁️ TaskFlow page became visible");

    if (!socket.connected && !socket.active) {
      console.log("🔄 Socket inactive - reconnecting...");

      socket.connect();
    }
  }
};

document.addEventListener("visibilitychange", handleVisibilityChange);

export default socket;
