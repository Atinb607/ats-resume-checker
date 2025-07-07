// ===== 📁 index.js =====
import dotenv from "dotenv";
import path from "path";

// ✅ Force load .env from correct server root directory
dotenv.config({ path: path.resolve('./.env') });

// ✅ Validate critical environment variables (updated for Gemini)
const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

if (process.env.NODE_ENV === 'development') {
  console.log('🔍 .env loaded successfully. Environment variables:');
  requiredVars.forEach(v => console.log(`${v}:`, process.env[v] ? '✅ Loaded' : '❌ Missing'));
  console.log('---');
}

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Routes
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import aiResumeRoutes from "./routes/aiResume.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ ATS Resume Checker server is running.");
});

// ✅ API status endpoint (updated for Gemini)
app.get("/api/status", (req, res) => {
  res.json({
    status: "✅ Server is up",
    env: {
      port: process.env.PORT,
      mongo: !!process.env.MONGO_URI,
      gemini: !!process.env.GEMINI_API_KEY
    }
  });
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiResumeRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ✅ Connect to MongoDB and start server
console.log("⏳ Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});

// ✅ Global error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});