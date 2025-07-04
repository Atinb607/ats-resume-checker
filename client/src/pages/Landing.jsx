import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
      <h1 className="text-5xl font-bold mb-6 text-blue-600">ATS Resume Checker</h1>
      <p className="mb-8 text-gray-700">Check your resume's ATS score and get suggestions.</p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</Link>
        <Link to="/signup" className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Sign Up</Link>
      </div>
    </div>
  );
};

export default Landing;