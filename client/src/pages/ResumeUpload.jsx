// client/src/pages/ResumeUpload.jsx
import React, { useState } from "react";
import axios from "../axios";
import { toast } from "react-toastify";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(res.data);
      toast.success("Resume scored successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload & Score"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 border rounded">
          <p><strong>Score:</strong> {result.score}/100</p>
          <p><strong>Keyword Match:</strong> {result.keywordDensity}%</p>
          <p><strong>Word Count:</strong> {result.wordCount}</p>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
            {result.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;