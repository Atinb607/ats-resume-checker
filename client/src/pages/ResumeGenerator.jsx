import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResumeGenerator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center border border-blue-500/20">
        <h1 className="text-2xl font-bold text-white mb-4">Resume Generator</h1>
        <p className="text-gray-300 mb-6">
          This feature is coming soon! We're working on an amazing resume generator.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
