import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      aria-label={isDarkMode ? "تغییر به حالت روز" : "تغییر به حالت شب"}
    >
      <div className="relative w-6 h-6 cursor-pointer">
        {/* Sun Icon */}
        <FaSun
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            isDarkMode
              ? "text-yellow-400 opacity-0 scale-0 rotate-90"
              : "text-yellow-500 opacity-100 scale-100 rotate-0"
          }`}
        />
        {/* Moon Icon */}
        <FaMoon
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            isDarkMode
              ? "text-blue-300 opacity-100 scale-100 rotate-0"
              : "text-gray-400 opacity-0 scale-0 -rotate-90"
          }`}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {isDarkMode ? "حالت روز" : "حالت شب"}
      </div>
    </button>
  );
};

export default ThemeToggle;
