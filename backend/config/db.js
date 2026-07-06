import mongoose from "mongoose";

console.log("MONGODB_URL =", process.env.MONGODB_URL);
console.log("MONGODB_URL =", process.env.MONGODB_URL);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};

export default connectDB;