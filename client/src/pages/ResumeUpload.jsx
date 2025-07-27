"use client"

import { useState } from "react"
import axios from "../api/axios" // Adjusted import path to match common structure
import { toast } from "react-toastify" // Assuming toast is configured externally
import { UploadCloud, FileText, Sparkles, CheckCircle, Info, Hash, Target, TrendingUp } from "lucide-react"

const ResumeUpload = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.")
      return
    }

    const formData = new FormData()
    formData.append("resume", file)

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const res = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setResult(res.data)
      toast.success("Resume scored successfully!")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
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

      <div className="relative z-10 w-full max-w-xl animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Resume Forge
          </h1>
          <p className="text-gray-400 text-sm">Upload your resume for a quick score!</p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <UploadCloud className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">Upload Your Resume</h2>
          </div>

          <p className="text-center text-sm text-gray-400 mb-6">
            Supported formats: <span className="font-semibold text-blue-400">.pdf</span>,{" "}
            <span className="font-semibold text-blue-400">.docx</span>
          </p>

          {/* File Input */}
          <div className="mb-8 flex flex-col items-center">
            <label
              htmlFor="resume-upload-input"
              className="relative flex items-center justify-center px-6 py-3 border-2 border-dashed border-purple-500 rounded-xl text-purple-400 cursor-pointer hover:border-purple-400 hover:text-purple-300 transition-all duration-300 group"
            >
              <input
                id="resume-upload-input"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-lg">{file ? "Change File" : "Choose Resume File"}</span>
            </label>
            {file && (
              <p className="text-sm text-gray-400 mt-3 flex items-center">
                <Info size={16} className="mr-1 text-purple-400" />
                Selected: <span className="font-medium text-white ml-1">{file.name}</span>
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Uploading...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Upload & Score
              </div>
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className="mt-8 p-6 bg-gray-900/30 rounded-xl border border-gray-700/50 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-2xl font-semibold text-white">Resume Score</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                {/* Score */}
                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800/50 flex items-center">
                  <Target size={20} className="text-blue-400 mr-3 flex-shrink-0" />
                  <p className="text-lg">
                    <strong className="text-white">Score:</strong>{" "}
                    <span className="text-blue-300 font-bold">{result.score}/100</span>
                  </p>
                </div>

                {/* Keyword Match */}
                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-800/50 flex items-center">
                  <Hash size={20} className="text-purple-400 mr-3 flex-shrink-0" />
                  <p className="text-lg">
                    <strong className="text-white">Keyword Match:</strong>{" "}
                    <span className="text-purple-300 font-bold">{result.keywordDensity}%</span>
                  </p>
                </div>

                {/* Word Count */}
                <div className="p-4 bg-green-900/30 rounded-lg border border-green-800/50 flex items-center">
                  <TrendingUp size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  <p className="text-lg">
                    <strong className="text-white">Word Count:</strong>{" "}
                    <span className="text-green-300 font-bold">{result.wordCount}</span>
                  </p>
                </div>

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <p className="text-white font-semibold mb-3 flex items-center">
                      <CheckCircle size={20} className="text-green-400 mr-2" />
                      Suggestions:
                    </p>
                    <ul className="list-none space-y-2">
                      {result.suggestions.map((s, idx) => (
                        <li key={idx} className="text-gray-400 flex items-start">
                          <span className="text-green-400 mr-2 mt-1 text-xl leading-none">&bull;</span>{" "}
                          {/* Custom bullet */}
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
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
      `}</style>
    </div>
  )
}

export default ResumeUpload
