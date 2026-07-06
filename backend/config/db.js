import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URL
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};

export default connectDB;