import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/api";
import DashboardNavbar from "../components/DashboardNavbar";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UploadCloud, Sparkles, CheckCircle, XCircle, Info } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/user");
        setUser(response.data.user);
      } catch (error) {
        console.error("User fetch error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to fetch user data");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.docx', '.pdf'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please upload a .docx or .pdf file.");
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = '';
        return;
      }
      
      setResumeFile(file);
      setScoreData(null);
    }
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setLoading(true);
      const response = await axios.post("/ai/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setScoreData(response.data);
      toast.success("AI analysis complete!");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      const errorMessage = error.response?.data?.message || "AI resume analysis failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#facc15";
    return "#ef4444";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 40) return "Good";
    return "Needs Improvement";
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full mx-4 border border-blue-500/20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Analyzing your resume...
              </h3>
              <p className="text-gray-400">
                This might take a moment.
              </p>
            </div>
          </div>
        </div>
      )}

      <DashboardNavbar user={user} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user ? `Welcome, ${user.username || user.email.split("@")[0]}!` : "Welcome!"}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Let's analyze your resume with AI and get you hired.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-blue-500/20 shadow-2xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
                <p className="text-gray-400">
                  Only .docx and .pdf files are supported for analysis.
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block w-full">
                  <input
                    type="file"
                    accept=".docx,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors">
                    <UploadCloud className="mx-auto h-12 w-12 text-blue-400 mb-4" />
                    <span className="text-white font-medium">
                      {resumeFile ? "Change File" : "Choose Resume File"}
                    </span>
                    {resumeFile && (
                      <div className="mt-2">
                        <CheckCircle className="inline h-5 w-5 text-green-400 mr-2" />
                        <span className="text-green-400 text-sm">
                          Selected: {resumeFile.name}
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <button
                onClick={handleUpload}
                disabled={!resumeFile || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>

              {/* Analysis Results */}
              {scoreData && (
                <div className="mt-12">
                  <div className="bg-gray-700/50 rounded-xl p-8 border border-blue-500/10">
                    <h3 className="text-2xl font-bold text-white mb-6">AI Analysis Results</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* ATS Score */}
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-white mb-4">ATS Score</h4>
                        <div className="w-32 h-32 mx-auto mb-4">
                          <CircularProgressbarWithChildren
                            value={scoreData.score}
                            styles={buildStyles({
                              textColor: getScoreColor(scoreData.score),
                              pathColor: getScoreColor(scoreData.score),
                              trailColor: "#374151",
                            })}
                          >
                            <div className="text-center">
                              <div className="text-2xl font-bold" style={{ color: getScoreColor(scoreData.score) }}>
                                {scoreData.score}
                              </div>
                              <div className="text-xs text-gray-400">/100 ATS Match</div>
                            </div>
                          </CircularProgressbarWithChildren>
                        </div>
                        <p className="text-sm font-medium" style={{ color: getScoreColor(scoreData.score) }}>
                          {getScoreLabel(scoreData.score)}
                        </p>
                      </div>

                      {/* Analysis Details */}
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <Info className="inline h-4 w-4 text-blue-400 mr-2" />
                          <span className="font-medium text-white">Summary Suggestion: </span>
                          <span className="text-gray-300">{scoreData.summarySuggestions || "No specific suggestions."}</span>
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <XCircle className="inline h-4 w-4 text-red-400 mr-2" />
                          <span className="font-medium text-white">Missing Sections: </span>
                          <span className="text-gray-300">
                            {scoreData.missingSections?.length > 0 ? scoreData.missingSections.join(", ") : "None"}
                          </span>
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <CheckCircle className="inline h-4 w-4 text-green-400 mr-2" />
                          <span className="font-medium text-white">Keyword Suggestions: </span>
                          <span className="text-gray-300">
                            {scoreData.keywordSuggestions?.length > 0 ? scoreData.keywordSuggestions.join(", ") : "N/A"}
                          </span>
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <Info className="inline h-4 w-4 text-yellow-400 mr-2" />
                          <span className="font-medium text-white">Formatting Issues: </span>
                          <span className="text-gray-300">
                            {scoreData.formattingIssues?.length > 0 ? scoreData.formattingIssues.join(", ") : "None"}
                          </span>
                        </div>

                        {scoreData.finalTips && (
                          <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                            <p className="text-blue-200">{scoreData.finalTips}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8 text-gray-400">
          © 2025 Resume Forge. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Dashboard;