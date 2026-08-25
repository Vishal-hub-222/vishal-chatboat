import mongoose from "mongoose";

const reconnectDelayMs = 30_000;
let reconnectTimer;

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const scheduleReconnect = () => {
  if (reconnectTimer || !process.env.MONGOOSE_URL) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = undefined;
    connectDB();
  }, reconnectDelayMs);
};

const connectDB = async () => {
  if (!process.env.MONGOOSE_URL) {
    console.error("MongoDB is not configured: set MONGOOSE_URL before using chat endpoints.");
    return false;
  }

  if (isDatabaseConnected() || mongoose.connection.readyState === 2) {
    return isDatabaseConnected();
  }

  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log("MongoDB is connected");
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}. Retrying in 30 seconds.`);
    scheduleReconnect();
    return false;
  }
};

mongoose.connection.on("disconnected", scheduleReconnect);

export default connectDB;
