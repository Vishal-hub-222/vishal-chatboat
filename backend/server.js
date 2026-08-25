import express from "express";
import dotenv from "dotenv";
import connectDB, { isDatabaseConnected } from "./config/db.js";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.get("/health", (_req, res) => {
  res.status(isDatabaseConnected() ? 200 : 503).json({
    status: isDatabaseConnected() ? "ok" : "degraded",
    database: isDatabaseConnected() ? "connected" : "unavailable",
  });
});

app.use("/api", (_req, res, next) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      error: "Chat service is temporarily unavailable because the database is disconnected.",
    });
  }

  next();
});
app.use("/api", chatRoutes);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  connectDB();
};

startServer();
