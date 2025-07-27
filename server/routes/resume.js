import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Comprehensive ATS keywords by category
const keywordCategories = {
  programming: [
    "JavaScript", "Python", "Java", "C++", "C#", "TypeScript", "PHP", "Ruby", "Go", "Rust",
    "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Shell", "Bash", "PowerShell"
  ],
  webDevelopment: [
    "React", "Angular", "Vue.js", "Node.js", "Express", "Next.js", "Nuxt.js", "jQuery",
    "Bootstrap", "Tailwind", "HTML", "CSS", "SASS", "LESS", "Webpack", "Vite", "Parcel"
  ],
  databases: [
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
    "SQLite", "Oracle", "SQL Server", "Neo4j", "CouchDB", "InfluxDB"
  ],
  cloudAndDevOps: [
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "CI/CD", "Terraform",
    "Ansible", "Chef", "Puppet", "GitLab", "GitHub Actions", "CircleCI", "Travis CI"
  ],
  frameworks: [
    "Spring", "Django", "Flask", "Rails", "Laravel", "ASP.NET", "Express.js", 
    "FastAPI", "Symfony", "CodeIgniter", "Zend", "Struts"
  ],
  tools: [
    "Git", "SVN", "Jira", "Confluence", "Slack", "Trello", "Asana", "Notion",
    "VS Code", "IntelliJ", "Eclipse", "Sublime", "Vim", "Emacs"
  ],
  methodologies: [
    "Agile", "Scrum", "Kanban", "DevOps", "TDD", "BDD", "Unit Testing", "Integration Testing",
    "Microservices", "SOA", "REST", "GraphQL", "API", "SOAP", "OAuth", "JWT"
  ],
  softSkills: [
    "Leadership", "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
    "Project Management", "Time Management", "Adaptability", "Creativity", "Innovation"
  ],
  certifications: [
    "AWS Certified", "Azure Certified", "Google Cloud", "PMP", "Scrum Master", "CISSP",
    "CompTIA", "Cisco", "Microsoft Certified", "Oracle Certified", "Salesforce"
  ]
};

// Flatten all keywords for scoring
const allKeywords = Object.values(keywordCategories).flat();

// Dynamic import for pdf-parse
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

// Enhanced text analysis function
function analyzeResumeText(text) {
  const normalizedText = text.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // Find keywords by category
  const foundByCategory = {};
  const allFound = [];
  const suggestions = [];
  
  Object.entries(keywordCategories).forEach(([category, keywords]) => {
    foundByCategory[category] = keywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );
    allFound.push(...foundByCategory[category]);
  });

  // Calculate scores
  const totalPossibleKeywords = allKeywords.length;
  const uniqueFoundKeywords = [...new Set(allFound)];
  const keywordScore = Math.min(100, Math.round((uniqueFoundKeywords.length / totalPossibleKeywords) * 100));
  
  // Generate category-specific suggestions
  Object.entries(keywordCategories).forEach(([category, keywords]) => {
    const missing = keywords.filter(keyword => 
      !normalizedText.includes(keyword.toLowerCase())
    );
    
    if (missing.length > 0 && foundByCategory[category].length < 3) {
      suggestions.push(`Add ${category} skills: ${missing.slice(0, 3).join(", ")}`);
    }
  });

  // Additional scoring factors
  let bonusScore = 0;
  
  // Check for action verbs
  const actionVerbs = [
    "achieved", "developed", "implemented", "managed", "led", "created", "designed",
    "optimized", "improved", "increased", "reduced", "streamlined", "collaborated",
    "delivered", "executed", "launched", "built", "architected", "scaled"
  ];
  
  const foundActionVerbs = actionVerbs.filter(verb => 
    normalizedText.includes(verb)
  );
  
  if (foundActionVerbs.length > 5) bonusScore += 10;
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+(%|\$|k|million|billion|years?|months?)/i.test(text);
  if (hasNumbers) bonusScore += 15;
  
  // Check for education section
  const hasEducation = /education|degree|university|college|bachelor|master|phd/i.test(text);
  if (hasEducation) bonusScore += 5;
  
  // Final score calculation
  const finalScore = Math.min(100, keywordScore + bonusScore);
  
  return {
    score: finalScore,
    keywordDensity: Math.round((uniqueFoundKeywords.length / totalPossibleKeywords) * 100),
    foundKeywords: uniqueFoundKeywords,
    foundByCategory,
    suggestions: suggestions.slice(0, 12),
    totalKeywords: totalPossibleKeywords,
    wordCount: words.length,
    actionVerbs: foundActionVerbs,
    hasQuantifiableAchievements: hasNumbers,
    hasEducation,
    detailedAnalysis: {
      strongCategories: Object.entries(foundByCategory)
        .filter(([_, keywords]) => keywords.length >= 2)
        .map(([category, keywords]) => ({
          category,
          count: keywords.length,
          keywords: keywords.slice(0, 5)
        })),
      weakCategories: Object.entries(foundByCategory)
        .filter(([_, keywords]) => keywords.length === 0)
        .map(([category, _]) => category),
      improvementAreas: suggestions
    }
  };
}

/**
 * @route POST /api/resume/upload
 * @desc Enhanced resume upload with comprehensive ATS analysis
 * @access Private (JWT protected)
 */
router.post("/upload", verifyToken, upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase();

  try {
    console.log(`📄 Processing resume: ${req.file.originalname} (${fileExt})`);
    
    const fileBuffer = fs.readFileSync(filePath);
    let text = "";

    // Extract text based on file type
    if (fileExt === ".pdf") {
      try {
        const parsed = await parsePDF(fileBuffer);
        text = parsed.text;
        console.log(`✅ PDF parsed successfully: ${text.length} characters`);
      } catch (pdfError) {
        console.error("PDF parsing failed:", pdfError);
        fs.unlinkSync(filePath);
        return res.status(400).json({
          message: "PDF parsing failed. Please try uploading a DOCX file instead.",
          supportedFormats: [".docx", ".pdf"]
        });
      }
    } else if (fileExt === ".docx") {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
      console.log(`✅ DOCX parsed successfully: ${text.length} characters`);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: "Unsupported file type. Please upload PDF or DOCX files only.",
        supportedFormats: [".docx", ".pdf"]
      });
    }

    // Validate extracted text
    if (!text || text.trim().length < 100) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "Resume content appears to be too short or couldn't be extracted. Please check your file."
      });
    }

    // Perform comprehensive analysis
    const analysis = analyzeResumeText(text);
    
    // Generate performance message
    let message;
    if (analysis.score >= 80) {
      message = "Outstanding resume! Excellent ATS compatibility and keyword optimization.";
    } else if (analysis.score >= 65) {
      message = "Strong resume with good ATS optimization. Minor improvements could boost your score.";
    } else if (analysis.score >= 50) {
      message = "Good foundation, but significant improvements needed for better ATS compatibility.";
    } else if (analysis.score >= 30) {
      message = "Resume needs substantial optimization to pass ATS screening effectively.";
    } else {
      message = "Resume requires major improvements for ATS compatibility. Focus on adding relevant keywords and quantifiable achievements.";
    }

    // Enhanced response with detailed breakdown
    const response = {
      ...analysis,
      message,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      analysisTimestamp: new Date().toISOString(),
      recommendations: {
        immediate: analysis.suggestions.slice(0, 3),
        secondary: analysis.suggestions.slice(3, 6),
        longTerm: analysis.suggestions.slice(6)
      },
      benchmarks: {
        excellent: 80,
        good: 65,
        fair: 50,
        poor: 30
      }
    };

    console.log(`📊 Analysis complete. Score: ${analysis.score}/100`);
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    return res.status(200).json(response);

  } catch (err) {
    console.error("❌ Resume analysis error:", err.message);
    
    // Clean up file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return res.status(500).json({ 
      message: "Failed to process resume: " + err.message,
      supportedFormats: [".docx", ".pdf"]
    });
  }
});

/**
 * @route GET /api/resume/keywords
 * @desc Get comprehensive ATS keywords by category
 * @access Private (JWT protected)
 */
router.get("/keywords", verifyToken, (req, res) => {
  const response = {
    categories: keywordCategories,
    totalKeywords: allKeywords.length,
    categoryStats: Object.entries(keywordCategories).map(([category, keywords]) => ({
      category,
      count: keywords.length,
      examples: keywords.slice(0, 5)
    })),
    scoringInfo: {
      maxScore: 100,
      bonusFactors: [
        "Action verbs usage (+10 points)",
        "Quantifiable achievements (+15 points)", 
        "Education section (+5 points)"
      ]
    }
  };
  
  res.status(200).json(response);
});

/**
 * @route GET /api/resume/analysis-guide
 * @desc Get detailed guide on how resume analysis works
 * @access Private (JWT protected)
 */
router.get("/analysis-guide", verifyToken, (req, res) => {
  res.status(200).json({
    title: "Resume Analysis Guide",
    scoringCriteria: {
      keywordMatching: "70% - Industry-relevant keywords and technical skills",
      actionVerbs: "10% - Strong action verbs that demonstrate impact",
      quantifiableAchievements: "15% - Numbers, percentages, and measurable results",
      structure: "5% - Proper sections and formatting"
    },
    improvementTips: [
      "Include specific technical skills relevant to your industry",
      "Use action verbs to start bullet points (achieved, developed, implemented)",
      "Quantify achievements with numbers, percentages, or dollar amounts",
      "Ensure all major resume sections are present (experience, education, skills)",
      "Tailor keywords to match the job description you're applying for"
    ],
    atsOptimization: [
      "Use standard section headings (Experience, Education, Skills)",
      "Avoid images, graphics, or complex formatting",
      "Include keywords throughout the resume, not just in a skills section",
      "Use common file formats (.docx or .pdf)",
      "Ensure consistent formatting and clear hierarchy"
    ]
  });
});

export default router;
