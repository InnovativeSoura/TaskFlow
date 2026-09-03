import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is missing.");
    }

    console.log("");
    console.log("======================================");
    console.log("Connecting to MongoDB...");
    console.log(
      "Mongo URI:",
      process.env.MONGODB_URL.replace(
        /\/\/([^:]+):([^@]+)@/,
        "//<username>:<password>@",
      ),
    );
    console.log("======================================");

    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Taskflow",
      autoIndex: true,
    });

    console.log("");
    console.log("======================================");
    console.log("✅ MongoDB Connected");
    console.log("🌍 Host       :", conn.connection.host);
    console.log("📂 Database   :", conn.connection.name);
    console.log("📡 ReadyState :", mongoose.connection.readyState);
    console.log("📌 Port       :", conn.connection.port);
    console.log("======================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("======================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    console.error("======================================");
    console.error("");

    process.exit(1);
  }
};

export default connectDB;
