// ===== 📁 index.js =====
import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Load env
dotenv.config({ path: path.resolve('./.env') });

// ✅ Validate required envs
const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY', 'FRONTEND_URL'];
const missingVars = requiredVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ Missing env vars:', missingVars.join(', '));
  process.exit(1);
}

// ✅ Setup Express app
const app = express();

// ✅ Advanced CORS setup
const allowedOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`❌ Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import aiResumeRoutes from "./routes/aiResume.js";

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiResumeRoutes);

// ✅ Health routes
app.get("/", (req, res) => res.send("✅ ATS Resume Checker server running"));
app.get("/api/status", (req, res) => {
  res.json({
    status: "✅ Server is up",
    port: process.env.PORT || 5000,
    mongo: !!process.env.MONGO_URI,
    gemini: !!process.env.GEMINI_API_KEY,
    frontend: process.env.FRONTEND_URL,
  });
});

// ✅ MongoDB and server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ Mongo connection failed:", err.message);
    process.exit(1);
  });

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});
