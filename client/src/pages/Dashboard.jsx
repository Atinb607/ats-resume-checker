"use client"

import { useState, useEffect } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify" // Assuming toast is configured externally
import DashboardNavbar from "../components/DashboardNavbar" // Assuming this component exists
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { UploadCloud, Sparkles, CheckCircle, XCircle, Info } from "lucide-react"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [scoreData, setScoreData] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return navigate("/login")

    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(res.data.user)
      } catch (err) {
        console.error("User fetch error:", err)
        localStorage.removeItem("token")
        navigate("/login")
      }
    }

    fetchUser()
  }, [navigate, token])

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0])
    setScoreData(null)
  }

  const handleUpload = async () => {
    if (!resumeFile || !resumeFile.name.endsWith(".docx")) {
      toast.error("Please upload a .docx file.")
      return
    }

    const formData = new FormData()
    formData.append("resume", resumeFile)

    try {
      setLoading(true)
      const res = await axios.post("/ai/analyze", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setScoreData(res.data)
      toast.success("AI analysis complete!")
    } catch (err) {
      console.error("AI Analysis Error:", err)
      toast.error(err.response?.data?.message || "AI resume analysis failed")
    } finally {
      setLoading(false)
    }
  }

  // Helper to get text color based on score (for the score number itself)
  const getScoreTextColor = (score) => {
    if (score >= 70) return "#22c55e" // green-500
    if (score >= 40) return "#facc15" // yellow-500
    return "#ef4444" // red-500
  }

  return (
    <>
      {/* SVG Definitions for Gradient and Grain Filter */}
      <svg style={{ height: 0, width: 0, position: "absolute" }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" /> {/* Indigo-500 */}
            <stop offset="100%" stopColor="#8B5CF6" /> {/* Violet-500 */}
          </linearGradient>
          <filter id="grainyFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
            <feComposite operator="in" in="noise" in2="SourceGraphic" result="grain" />
            <feBlend mode="multiply" in="SourceGraphic" in2="grain" />
          </filter>
        </defs>
      </svg>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-md transition-opacity duration-300 ease-in-out">
          <div className="bg-gray-800/90 px-10 py-8 rounded-2xl shadow-2xl text-center animate-fade-in border border-gray-700">
            <div className="border-4 border-t-4 border-blue-500 border-solid rounded-full h-16 w-16 mb-6 mx-auto animate-spin"></div>
            <p className="text-xl font-semibold text-white">Analyzing your resume...</p>
            <p className="text-sm text-gray-400 mt-2">This might take a moment.</p>
          </div>
        </div>
      )}

      {/* Assuming DashboardNavbar is a separate component */}
      <DashboardNavbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-3xl animate-slide-up">
          {/* Welcome Section */}
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user ? `Welcome, ${user.username || user.email.split("@")[0]}!` : "Welcome!"}
            </h2>
            <p className="text-gray-400 text-lg">Let's analyze your resume with AI and get you hired.</p>
          </div>

          {/* Main Content Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <UploadCloud className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-2xl font-semibold text-white">Upload Your Resume</h3>
            </div>

            <p className="text-center text-sm text-gray-400 mb-6">
              Only <span className="font-semibold text-blue-400">.docx</span> files are supported for analysis.
            </p>

            {/* File Upload */}
            <div className="mb-8 flex flex-col items-center">
              <label
                htmlFor="resume-upload"
                className="relative flex items-center justify-center px-6 py-3 border-2 border-dashed border-blue-500 rounded-xl text-blue-400 cursor-pointer hover:border-blue-400 hover:text-blue-300 transition-all duration-300 group"
              >
                <input id="resume-upload" type="file" accept=".docx" onChange={handleFileChange} className="hidden" />
                <UploadCloud className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-lg">{resumeFile ? "Change File" : "Choose Resume File"}</span>
              </label>
              {resumeFile && (
                <p className="text-sm text-gray-400 mt-3 flex items-center">
                  <Info size={16} className="mr-1 text-blue-400" />
                  Selected: <span className="font-medium text-white ml-1">{resumeFile.name}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!resumeFile || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Analyzing with AI...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Upload & Analyze Resume
                </div>
              )}
            </button>

            {!loading && !scoreData && resumeFile && (
              <div className="mt-6 p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center animate-fade-in">
                <XCircle size={20} className="mr-2" />
                <p className="text-sm font-medium">
                  Analysis failed or incomplete. Please check your file and try again.
                </p>
              </div>
            )}

            {scoreData && (
              <div className="mt-8 p-6 bg-gray-900/30 rounded-xl border border-gray-700/50 animate-fade-in">
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">AI Analysis Results</h3>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-4 text-center text-white">ATS Score</h4>
                  <div className="w-40 h-40 mx-auto score-dial-container">
                    {" "}
                    {/* Added class for CSS targeting */}
                    <CircularProgressbarWithChildren
                      value={scoreData.score}
                      maxValue={100}
                      styles={buildStyles({
                        pathColor: `url(#scoreGradient)`, // Use the gradient ID
                        trailColor: "#374151", // gray-700
                        textColor: getScoreTextColor(scoreData.score), // Text color based on score
                        textSize: "24px", // Larger text size
                        pathTransitionDuration: 0.5,
                        strokeLinecap: "round", // Modern look
                      })}
                    >
                      <div className="text-4xl font-bold" style={{ color: getScoreTextColor(scoreData.score) }}>
                        {scoreData.score}
                      </div>
                      <p className="text-sm text-gray-400">/100 ATS Match</p>
                    </CircularProgressbarWithChildren>
                  </div>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm">
                      <strong className="text-white">Summary Suggestion:</strong>{" "}
                      {scoreData.summarySuggestions || "No specific suggestions."}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm">
                      <strong className="text-white">Missing Sections:</strong>{" "}
                      {scoreData.missingSections?.length > 0 ? scoreData.missingSections.join(", ") : "None"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm">
                      <strong className="text-white">Keyword Suggestions:</strong>{" "}
                      {scoreData.keywordSuggestions?.length > 0 ? scoreData.keywordSuggestions.join(", ") : "N/A"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm">
                      <strong className="text-white">Formatting Issues:</strong>{" "}
                      {scoreData.formattingIssues?.length > 0 ? scoreData.formattingIssues.join(", ") : "None"}
                    </p>
                  </div>

                  <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium mt-4 flex items-center">
                    <CheckCircle size={20} className="mr-2" />
                    <p className="text-sm">{scoreData.finalTips}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-xs animate-fade-in-delay">
          <p>© 2024 Resume Forge. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.5s both;
        }

        /* Apply grain filter to the CircularProgressbar path */
        .score-dial-container .CircularProgressbar-path {
          filter: url(#grainyFilter);
        }
      `}</style>
    </>
  )
}

export default Dashboard