import mongoose  from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGOOSE_URL) {
    throw new Error("MONGOOSE_URL is not configured");
  }

  await mongoose.connect(process.env.MONGOOSE_URL);
  console.log("MongoDB is connected");
};

export default connectDB;
