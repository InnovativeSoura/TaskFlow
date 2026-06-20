const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require(
  "./config/db"
);

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/comments",
  require("./routes/commentRoutes")
);

app.use(
  "/api/notifications",
  require(
    "./routes/notificationRoutes"
  )
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/files",
  require("./routes/fileRoutes")
);

app.use(
  "/uploads",
  express.static(
    "uploads"
  )
);

app.use(
  "/api/activities",
  require(
    "./routes/activityRoutes"
  )
);

app.use(
  "/api/admin",
  require(
    "./routes/adminRoutes"
  )
);

app.use(
  "/api/ai",
  require("./routes/aiRoutes")
);

app.get("/", (req, res) => {
  res.send(
    "TaskFlow API Running..."
  );
});

app.use(
  "/api/messages",
  require(
    "./routes/messageRoutes"
  )
);

app.use(
  "/api/ai",
  require("./routes/aiRoutes")
);

app.use(
  "/api/invitations",
  require(
    "./routes/invitationRoutes"
  )
);

app.use(
  "/api/export",
  require(
    "./routes/exportRoutes"
  )
);

app.use(
  "/api/analytics",
  require(
    "./routes/analyticsRoutes"
  )
);

app.use(
  "/api/payment",
  require(
    "./routes/paymentRoutes"
  )
);

app.use(
  "/api/webhook",
  require("./routes/webhookRoutes")
);

app.use(
  "/api/workspaces",
  require("./routes/workspaceRoutes")
);

const PORT =
  process.env.PORT || 5000;

const http = require("http");

const {
  initializeSocket,
} = require("./sockets/socket");

const server =
  http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});