// backend/config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is missing.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      autoIndex: true,
    });

    console.log("======================================");
    console.log("✅ MongoDB Connected");
    console.log(`🌍 Host     : ${conn.connection.host}`);
    console.log(`📂 Database : ${conn.connection.name}`);
    console.log("======================================");
  } catch (error) {
    console.error("======================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("======================================");
    process.exit(1);
  }
};

export default connectDB;