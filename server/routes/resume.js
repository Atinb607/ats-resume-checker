import express from "express";
import multer from "multer";
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
  "API", "HTML", "CSS", "Express", "Git", "Python",
  "Java", "SQL", "Docker", "AWS", "Azure", "TypeScript",
  "Angular", "Vue", "Spring", "Django", "Flask", "PostgreSQL",
  "MySQL", "Redis", "GraphQL", "Microservices", "Kubernetes",
  "Jenkins", "CI/CD", "Agile", "Scrum", "TDD", "Unit Testing"
];

// Dynamic import for pdf-parse to avoid initialization issues
async function parsePDF(buffer) {
  try {
    const pdfParse = await import("pdf-parse");
    const parseFunction = pdfParse.default || pdfParse;
    return await parseFunction(buffer);
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF file");
  }
}

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
      try {
        const parsed = await parsePDF(fileBuffer);
        text = parsed.text;
      } catch (pdfError) {
        console.error("PDF parsing failed:", pdfError);
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          message: "PDF parsing failed. Please try uploading a DOCX file instead." 
        });
      }
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
    const foundKeywords = [];
    const suggestions = [];

    keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += Math.round(100 / keywords.length); // Distribute score evenly
        foundKeywords.push(keyword);
      } else {
        suggestions.push(`Consider adding: ${keyword}`);
      }
    });

    if (score > 100) score = 100;

    // Calculate additional metrics
    const keywordDensity = Math.round((foundKeywords.length / keywords.length) * 100);
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    fs.unlinkSync(filePath); // Always clean up

    return res.status(200).json({ 
      score, 
      keywordDensity,
      suggestions: suggestions.slice(0, 8), // Limit suggestions
      foundKeywords,
      totalKeywords: keywords.length,
      wordCount,
      message: score >= 70 ? "Excellent resume!" : score >= 50 ? "Good resume, but can be improved." : "Resume needs significant improvement."
    });
  } catch (err) {
    console.error("❌ Resume scoring error:", err.message);
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    return res.status(500).json({ message: "Failed to process resume: " + err.message });
  }
});

/**
 * @route   GET /api/resume/keywords
 * @desc    Get the list of ATS keywords being checked
 * @access  Private (JWT protected)
 */
router.get("/keywords", verifyToken, (req, res) => {
  res.status(200).json({ keywords, total: keywords.length });
});

export default router;