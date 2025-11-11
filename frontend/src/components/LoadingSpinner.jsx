import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'medium', text = 'در حال بارگذاری...', fullScreen = false }) => {
  const { isDarkMode } = useTheme();
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${
      fullScreen ? 'min-h-screen' : 'py-8'
    }`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent animate-spin ${
          isDarkMode 
            ? 'border-blue-500 border-l-blue-300 border-b-blue-300' 
            : 'border-blue-600 border-l-blue-400 border-b-blue-400'
        }`}></div>
        <div className={`absolute inset-2 rounded-full border-2 border-t-transparent animate-spin animation-delay-150 ${
          isDarkMode 
            ? 'border-purple-500 border-l-purple-300 border-b-transparent' 
            : 'border-purple-600 border-l-purple-400 border-b-transparent'
        }`}></div>
      </div>
      {text && (
        <p className={`text-sm font-medium animate-pulse ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'
      } backdrop-blur-sm`}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;