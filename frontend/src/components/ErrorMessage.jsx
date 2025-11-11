import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

const ErrorMessage = ({ 
  title = 'خطا در بارگذاری', 
  message = 'متأسفانه در بارگذاری اطلاعات مشکلی پیش آمده است.',
  onRetry = null,
  onGoHome = null,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const { isDarkMode } = useTheme();
  
  const typeStyles = {
    error: {
      icon: '🔥',
      bgColor: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
      borderColor: isDarkMode ? 'border-red-500/30' : 'border-red-200',
      textColor: isDarkMode ? 'text-red-300' : 'text-red-600',
      titleColor: isDarkMode ? 'text-red-200' : 'text-red-700'
    },
    warning: {
      icon: '⚠️',
      bgColor: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
      borderColor: isDarkMode ? 'border-yellow-500/30' : 'border-yellow-200',
      textColor: isDarkMode ? 'text-yellow-300' : 'text-yellow-600',
      titleColor: isDarkMode ? 'text-yellow-200' : 'text-yellow-700'
    },
    info: {
      icon: '💡',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: isDarkMode ? 'border-blue-500/30' : 'border-blue-200',
      textColor: isDarkMode ? 'text-blue-300' : 'text-blue-600',
      titleColor: isDarkMode ? 'text-blue-200' : 'text-blue-700'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className={`rounded-2xl border p-8 text-center max-w-md mx-auto ${
      styles.bgColor
    } ${styles.borderColor} ${
      isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : ''
    }`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Icon */}
        <div className={`text-4xl mb-4 ${styles.textColor}`}>
          {styles.icon}
        </div>
        
        {/* Title */}
        <h3 className={`text-xl font-bold ${styles.titleColor}`}>
          {title}
        </h3>
        
        {/* Message */}
        <p className={`text-sm leading-relaxed ${styles.textColor}`}>
          {message}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FaRedo className="w-4 h-4" />
              <span>تلاش مجدد</span>
            </button>
          )}
          
          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span>بازگشت به خانه</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;