import express from "express";
import multerPkg from "multer";
const multer = multerPkg.default;

import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup — temp file saved to /uploads
const upload = multer({ dest: "uploads/" });

// Define ATS keywords
const keywords = [
  "JavaScript", "React", "Node.js", "MongoDB", "REST",
  "API", "HTML", "CSS", "Express", "Git"
];

/**
 * @route   POST /api/resume/upload
 * @desc    Upload a resume (PDF or DOCX), score it based on ATS keywords
 * @access  Private (JWT protected)
 */
router.post("/upload", verifyToken, upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase();

  try {
    const fileBuffer = fs.readFileSync(filePath);
    let text = "";

    if (fileExt === ".pdf") {
      const parsed = await pdfParse(fileBuffer);
      text = parsed.text;
    } else if (fileExt === ".docx") {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      fs.unlinkSync(filePath); // Delete unsupported file
      return res.status(400).json({ message: "Unsupported file type. Use PDF or DOCX." });
    }

    // Normalize and score
    text = text.toLowerCase();
    let score = 0;
    const suggestions = [];

    keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
      } else {
        suggestions.push(`Add the keyword: ${keyword}`);
      }
    });

    if (score > 100) score = 100;

    fs.unlinkSync(filePath); // Always clean up

    return res.status(200).json({ score, suggestions });
  } catch (err) {
    console.error("❌ Resume scoring error:", err.message);
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    return res.status(500).json({ message: "Failed to process resume." });
  }
});

export default router;