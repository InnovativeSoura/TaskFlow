import { io } from "socket.io-client";

const socket = io(
"http://localhost:5000",
{
autoConnect: false,
transports: [
"websocket",
"polling",
],
}
);

export const connectSocket = () => {
if (!socket.connected) {
socket.connect();
}
};

export const disconnectSocket = () => {
if (socket.connected) {
socket.disconnect();
}
};

socket.on("connect", () => {
console.log(
"✅ Socket Connected:",
socket.id
);
});

socket.on(
"connect_error",
(err) => {
console.error(
"⚠️ Socket Connection Error:",
err.message
);
}
);

socket.on("disconnect", () => {
console.log(
"❌ Socket Disconnected"
);
});

export default socket;
