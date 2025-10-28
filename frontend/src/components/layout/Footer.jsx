import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <footer className={`backdrop-blur-sm text-center py-8 shadow-soft mt-8 transition-all duration-300 ${
      isDarkMode 
        ? "bg-[#0E2148]/90 text-white" 
        : "bg-[#604bfb]/90 text-white border-t border-white/20"
    }`}>
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-[#E3D095] text-[#0E2148] rounded-full p-2">
            🌐
          </span>
          <span className={`font-bold text-lg transition-all duration-300 ${
            isDarkMode ? "text-white" : "text-white"
          }`}>جدید</span>
        </div>
        <div className={`text-sm transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-white"
        }`}>
          © {new Date().getFullYear()} مزایده گر. همه حقوق محفوظ است.
        </div>
        <div className="flex gap-4">
          <a
            href="#"
            className={`transition-colors duration-200 ${
              isDarkMode 
                ? "text-white hover:text-[#E3D095]" 
                : "text-white hover:text-[#E3D095]"
            }`}
          >
            درباره ما
          </a>
          <a
            href="#"
            className={`transition-colors duration-200 ${
              isDarkMode 
                ? "text-white hover:text-[#E3D095]" 
                : "text-white hover:text-[#E3D095]"
            }`}
          >
            تماس با ما
          </a>
          <a
            href="#"
            className={`transition-colors duration-200 ${
              isDarkMode 
                ? "text-white hover:text-[#E3D095]" 
                : "text-white hover:text-[#E3D095]"
            }`}
          >
            قوانین
          </a>
        </div>
      </div>
    </div>
    </footer>
  );
};

export default Footer;
