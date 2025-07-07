import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardNavbar from '../components/DashboardNavbar';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("User fetch error:", err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, token]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setScoreData(null);
  };

  const handleUpload = async () => {
    if (!resumeFile || !resumeFile.name.endsWith('.docx')) {
      toast.error("Please upload a .docx file.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      setLoading(true);
      const res = await axios.post('/ai/analyze', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setScoreData(res.data);
      toast.success("AI analysis complete!");
    } catch (err) {
      console.error("AI Analysis Error:", err);
      toast.error(err.response?.data?.message || 'AI resume analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="bg-white/70 px-8 py-6 rounded-xl shadow-xl text-center animate-fade-in">
            <div className="border-4 border-t-4 border-blue-500 border-solid rounded-full h-12 w-12 mb-4 animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700">Analyzing your resume...</p>
          </div>
        </div>
      )}

      <DashboardNavbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {user ? `Welcome, ${user.username || user.email}` : 'Welcome!'}
          </h2>

          <p className="text-center text-sm text-gray-500 mb-6">
            Only <span className="font-semibold text-blue-600">.docx</span> files are supported.
          </p>

          {/* File Upload */}
          <div className="mb-6 flex flex-col items-center">
            <label
              htmlFor="resume-upload"
              className="text-blue-600 hover:text-blue-800 cursor-pointer border border-blue-500 rounded px-4 py-2 transition-all duration-200"
            >
              Choose Resume File
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="hidden"
            />
            {resumeFile && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: <span className="font-medium">{resumeFile.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            {loading ? 'Analyzing with AI...' : 'Upload & Analyze Resume'}
          </button>

          {!loading && !scoreData && resumeFile && (
            <p className="text-sm text-red-600 mt-4">Analysis failed or incomplete. Check your file and try again.</p>
          )}

          {scoreData && (
            <div className="mt-6 bg-gray-50 p-4 rounded border">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3 text-center">ATS Score</h3>
                <div className="w-32 h-32 mx-auto">
                  <CircularProgressbarWithChildren
                    value={scoreData.score}
                    maxValue={100}
                    styles={buildStyles({
                      pathColor: scoreData.score >= 70 ? "#22c55e" : scoreData.score >= 40 ? "#facc15" : "#ef4444",
                      trailColor: "#e5e7eb",
                    })}
                  >
                    <div className="text-lg font-bold text-gray-800">{scoreData.score}/100</div>
                  </CircularProgressbarWithChildren>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Summary Suggestion:</strong> {scoreData.summarySuggestions}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Missing Sections:</strong> {scoreData.missingSections?.join(', ') || 'None'}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Keyword Suggestions:</strong> {scoreData.keywordSuggestions?.join(', ') || 'N/A'}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Formatting Issues:</strong> {scoreData.formattingIssues?.join(', ') || 'None'}
              </p>

              <p className="text-green-700 font-medium mt-2">
                {scoreData.finalTips}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
