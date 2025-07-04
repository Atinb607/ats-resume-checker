import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ ATS Resume Checker server is running.");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});