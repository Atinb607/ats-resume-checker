import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, token]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) return alert('Please select a resume file.');

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      setLoading(true);
      const res = await axios.post('/resume/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setScoreData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Resume upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>

        {/* Resume Upload */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Analyzing...' : 'Upload & Check ATS Score'}
        </button>

        {/* Score Result */}
        {scoreData && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">ATS Score: {scoreData.score}/100</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {scoreData.suggestions.map((sug, idx) => (
                <li key={idx}>{sug}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
