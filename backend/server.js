const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const connectDB = require("./config/db");
const { initializeSocket } = require("./sockets/socket");

connectDB();

const app = express();
const server = http.createServer(app);

// ================================
// CORS
// ================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://taskflow-1-73qh.onrender.com",
  "https://peaceful-ganache-04f280.netlify.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Express 5 Compatible
app.options(/.*/, cors());

// ================================
// Middleware
// ================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/uploads", express.static("uploads"));

// ================================
// Routes
// ================================
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/projects", require("./routes/projectRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.use("/api/comments", require("./routes/commentRoutes"));

app.use("/api/messages", require("./routes/messageRoutes"));

app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);

app.use(
  "/api/activities",
  require("./routes/activityRoutes")
);

app.use(
  "/api/workspaces",
  require("./routes/workspaceRoutes")
);

app.use(
  "/api/analytics",
  require("./routes/analyticsRoutes")
);

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/ai", require("./routes/aiRoutes"));

app.use(
  "/api/invitations",
  require("./routes/invitationRoutes")
);

app.use("/api/export", require("./routes/exportRoutes"));

app.use(
  "/api/payment",
  require("./routes/paymentRoutes")
);

app.use(
  "/api/webhook",
  require("./routes/webhookRoutes")
);

// ================================
// Health Check
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API Running 🚀",
  });
});

// ================================
// 404 Handler
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================================
// Error Handler
// ================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================================
// Socket.IO
// ================================

initializeSocket(server);

// ================================
// Start Server
// ================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});