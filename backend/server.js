import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";


app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);
app.use(cors({origin: ["http://localhost:5173","https://taskflow-1-73qh.onrender.com",],
    credentials: true,
  })
)


const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});