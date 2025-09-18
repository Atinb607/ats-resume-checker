import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className={`text-gray-300 ${textSizeClasses[size]}`}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;