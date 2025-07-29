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

// Enhanced PDF parsing with dynamic import
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

// Extract text from supported file formats
async function extractText(filePath, ext) {
  const buffer = fs.readFileSync(filePath);
  
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (ext === ".pdf") {
    const parsed = await parsePDF(buffer);
    return parsed.text;
  }
  
  throw new Error("Only .docx and .pdf files are supported for AI analysis.");
}

// Enhanced Gemini prompt for comprehensive analysis
function buildPrompt(resumeText) {
  return `You are an expert resume analyst and career consultant with 15+ years of experience in talent acquisition, HR strategy, and ATS optimization.

Your task is to critically analyze the following resume and return **a detailed, structured JSON response** with **actionable feedback written in numbered points**.

====================
📄 Resume Content:
"""
${resumeText}
"""
====================

First, detect whether this resume belongs to:
- A **Fresher** (0–1 years of experience)
- An **Experienced Professional** (2+ years of experience)
Tailor your analysis and suggestions accordingly based on the candidate’s level.

📢 **Output Format**
Return only a **valid, clean JSON** (no extra text or markdown). Every suggestion inside each section must be written as **numbered bullet points**. Follow this exact structure:

{
  "candidateType": "Fresher" | "Experienced",
  "score": [number from 0 to 100 based on resume quality],
  "summarySuggestions": [
    "1. Point-based, clear feedback on the professional summary or objective.",
    "2. Suggestions tailored to fresher or experienced profile."
  ],
  "missingSections": [
    "1. Mention sections that are missing or underdeveloped.",
    "2. Example: Certifications, Projects, Internships, etc."
  ],
  "keywordSuggestions": [
    "1. Important keywords or tools missing for this candidate's industry.",
    "2. Action verbs to strengthen impact.",
    "3. Soft skills or industry-specific terms that enhance ATS match."
  ],
  "formattingIssues": [
    "1. Issues with font, layout, alignment, or ATS compatibility.",
    "2. Suggestions for improving structure and readability."
  ],
  "contentImprovements": [
    "1. Ways to improve descriptions, quantify achievements, or rewrite vague lines.",
    "2. Areas where content lacks clarity or depth."
  ],
  "strengthsIdentified": [
    "1. Strong areas of the resume — content, design, or keyword usage.",
    "2. Accomplishments or experience that stand out."
  ],
  "industryAlignment": [
    "1. Does the resume meet current expectations for the intended role or industry?",
    "2. Recommendations to better align with trends."
  ],
  "atsCompatibility": [
    "1. Evaluate formatting, keyword usage, file structure for ATS parsing.",
    "2. Fixes to improve ATS readability."
  ],
  "competitiveAdvantage": [
    "1. Suggestions to differentiate from other applicants.",
    "2. Unique elements or branding strategies."
  ],
  "finalTips": [
    "1. Most important tip for immediate improvement.",
    "2. Second most important improvement.",
    "3. Continue up to 5 key changes, in priority order."
  ]
}

📌 Notes:
- Use **numbered points inside all sections** (e.g., “1. …”, “2. …”).
- If a section has no issues, still respond with "No major issues found." in a numbered format.
- Tailor tone and suggestions based on whether the user is a **fresher or experienced**.

Focus on high-impact, job-market-relevant feedback. Return **JSON only** — no explanations, markdown, or formatting outside JSON.`;
}

// POST /api/ai/analyze - Enhanced comprehensive analysis
router.post("/analyze", verifyToken, upload.single("resume"), async (req, res) => {
  const filePath = req.file?.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    console.log(`🔍 Starting AI analysis for file: ${req.file.originalname}`);
    
    // Extract text from resume
    const text = await extractText(filePath, ext);
    
    if (!text || text.trim().length < 50) {
      throw new Error("Resume content appears to be too short or couldn't be extracted properly");
    }

    console.log(`📄 Extracted ${text.length} characters from resume`);
    
    // Build comprehensive prompt
    const prompt = buildPrompt(text);

    // ✅ Generate content using Gemini AI
    console.log("🤖 Sending request to Gemini AI...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    console.log("✅ Received response from Gemini AI");

    let parsed;
    try {
      // Clean the response to extract only JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
      parsed = JSON.parse(jsonString);

      // Validate required fields and set defaults if missing
      const defaultResponse = {
        score: 0,
        summarySuggestions: "No specific suggestions available.",
        missingSections: [],
        keywordSuggestions: [],
        formattingIssues: [],
        contentImprovements: [],
        strengthsIdentified: [],
        industryAlignment: "Unable to assess industry alignment.",
        atsCompatibility: "Unable to assess ATS compatibility.",
        competitiveAdvantage: "No specific competitive advantage suggestions available.",
        finalTips: "Focus on quantifying achievements and using action verbs."
      };

      // Merge with defaults to ensure all fields exist
      parsed = { ...defaultResponse, ...parsed };

      // Ensure arrays are actually arrays
      const arrayFields = ['missingSections', 'keywordSuggestions', 'formattingIssues', 'contentImprovements', 'strengthsIdentified'];
      arrayFields.forEach(field => {
        if (!Array.isArray(parsed[field])) {
          parsed[field] = [];
        }
      });

      // Ensure score is a valid number
      if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100) {
        parsed.score = 50; // Default score
      }

      console.log(`📊 Analysis complete. Score: ${parsed.score}/100`);

    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      console.error("Raw response:", generatedText.substring(0, 500) + "...");
      
      // Return a structured error response instead of throwing
      parsed = {
        score: 0,
        summarySuggestions: "Unable to generate detailed analysis due to processing error. Please try uploading your resume again.",
        missingSections: ["Unable to analyze sections"],
        keywordSuggestions: ["Please try again for keyword suggestions"],
        formattingIssues: ["Analysis could not be completed"],
        contentImprovements: ["Please re-upload for content analysis"],
        strengthsIdentified: [],
        industryAlignment: "Analysis incomplete",
        atsCompatibility: "Analysis incomplete", 
        competitiveAdvantage: "Analysis incomplete",
        finalTips: "Please try uploading your resume again for a complete analysis."
      };
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.status(200).json(parsed);

  } catch (err) {
    console.error("❌ AI Resume Analysis Error:", err.message);
    
    // Handle specific error types
    if (err.message.includes('API_KEY_INVALID')) {
      res.status(401).json({ message: "Invalid Gemini API key configuration." });
    } else if (err.message.includes('QUOTA_EXCEEDED')) {
      res.status(429).json({ message: "AI analysis quota exceeded. Please try again later." });
    } else if (err.message.includes('SAFETY')) {
      res.status(400).json({ message: "Content blocked by safety filters. Please try with a different resume." });
    } else if (err.message.includes('too short')) {
      res.status(400).json({ message: "Resume content appears incomplete. Please check your file and try again." });
    } else {
      res.status(500).json({ 
        message: "Resume analysis failed. Please upload a valid .docx or .pdf file.",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

// GET /api/ai/status - Check AI service status
router.get("/status", verifyToken, (req, res) => {
  res.status(200).json({
    status: "operational",
    service: "Gemini AI Resume Analysis",
    supportedFormats: [".docx", ".pdf"],
    features: [
      "Comprehensive resume scoring",
      "Content analysis and suggestions", 
      "ATS compatibility assessment",
      "Industry alignment review",
      "Competitive advantage recommendations"
    ]
  });
});

export default router;
