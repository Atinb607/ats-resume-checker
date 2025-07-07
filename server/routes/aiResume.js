import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve('./.env') });

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Validate Gemini API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable is missing!");
  console.error("Please check your .env file and ensure it contains a valid GEMINI_API_KEY");
  process.exit(1);
}

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Extract text from .docx
async function extractText(filePath, ext) {
  const buffer = fs.readFileSync(filePath);

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Only .docx files are supported for AI analysis.");
}

// Generate Gemini prompt
function buildPrompt(resumeText) {
  return `You are a resume analyst for an Applicant Tracking System (ATS).
Analyze the following resume and return insights in JSON format ONLY.

Resume:
"""
${resumeText}
"""

Analyze the resume and provide feedback in the following JSON format. Return ONLY valid JSON without any additional text or formatting:

{
  "score": [number between 0 and 100],
  "summarySuggestions": "Summary improvements",
  "missingSections": ["e.g. Certifications", "Projects"],
  "keywordSuggestions": ["React", "Docker"],
  "formattingIssues": ["Inconsistent fonts", "Missing section headings"],
  "finalTips": "Final tips to improve the resume"
}

Return only the JSON object, no other text.`;
}

// POST /api/ai/analyze
router.post("/analyze", verifyToken, upload.single("resume"), async (req, res) => {
  const filePath = req.file?.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    const text = await extractText(filePath, ext);
    const prompt = buildPrompt(text);

    // ✅ Generate content using Gemini AI
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    let parsed;
    try {
      // Clean the response to extract only JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      console.error("Raw response:", generatedText);
      throw new Error("Invalid JSON response from Gemini AI");
    }

    fs.unlinkSync(filePath); // Clean up
    res.status(200).json(parsed);
  } catch (err) {
    console.error("❌ AI Resume Analysis Error:", err.message);

    // Handle specific Gemini API errors
    if (err.message.includes('API_KEY_INVALID')) {
      res.status(401).json({ message: "Invalid Gemini API key configuration." });
    } else if (err.message.includes('QUOTA_EXCEEDED')) {
      res.status(429).json({ message: "Gemini API quota exceeded. Please try again later." });
    } else if (err.message.includes('SAFETY')) {
      res.status(400).json({ message: "Content blocked by safety filters. Please try with a different resume." });
    } else {
      res.status(500).json({ message: "Resume analysis failed. Please upload a valid .docx file." });
    }

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

export default router;