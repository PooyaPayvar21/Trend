import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ResponsiveTester from "../ResponsiveTester";
import { useTheme } from "../../context/ThemeContext";

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
      }`}
    >
      <Header />
      <main
        className={`flex-grow transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-900/50 backdrop-blur-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
      <Footer />
      <ResponsiveTester />
    </div>
  );
};

export default Layout;
