import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage synchronously to avoid initial flash
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const isDark = savedTheme ? savedTheme === "dark" : true; // default to dark
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
      return isDark;
    } catch {
      return true;
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    
    // Update document class for global styling
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};