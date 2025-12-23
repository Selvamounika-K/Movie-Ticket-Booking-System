import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("MONGO_URI =>", process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  }
};
