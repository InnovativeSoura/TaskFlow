const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const dns = require ("dns");
dns.setServers([
  "1.1.1.1","8.8.8.8"
])

const connectDB = require("./config/db");
const { initializeSocket } = require("./sockets/socket");



dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors({origin: ["http://localhost:5173","https://taskflow-1-73qh.onrender.com","https://peaceful-ganache-04f280.netlify.app",],
credentials: true,
methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
allowedHeaders: ["Content-Type", "Authorization"],})
);

app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/comments", require("./routes/commentRoutes"));

app.use(
"/api/notifications",
require("./routes/notificationRoutes")
);

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/files", require("./routes/fileRoutes"));

app.use("/uploads", express.static("uploads"));

app.use(
"/api/activities",
require("./routes/activityRoutes")
);

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/ai", require("./routes/aiRoutes"));

app.use(
"/api/messages",
require("./routes/messageRoutes")
);

app.use(
"/api/invitations",
require("./routes/invitationRoutes")
);

app.use(
"/api/export",
require("./routes/exportRoutes")
);

app.use(
"/api/analytics",
require("./routes/analyticsRoutes")
);

// Razorpay routes can be added later
app.use("/api/payment", require("./routes/paymentRoutes"));

app.use(
"/api/webhook",
require("./routes/webhookRoutes")
);

app.use(
"/api/workspaces",
require("./routes/workspaceRoutes")
);

app.use("/api/projects", require("./routes/projectRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

// Health Check
app.get("/", (req, res) => {
res.send("TaskFlow API Running...");
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
