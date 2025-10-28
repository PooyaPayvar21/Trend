import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import QuickRegisterModal from "./components/QuickRegisterModal";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Trend from "./pages/Trend";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auctions from "./pages/Auctions";
import ForgotPassword from "./pages/ForgotPassword";
import Inquiry from "./pages/Inquiry";
import Global from "./pages/Global";
import Subscription from "./pages/Subscription";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CreateAuction from "./pages/CreateAuction";
import CreateTender from "./pages/CreateTender";
import AdminDashboard from "./pages/AdminDashboard";

const AppContent = () => {
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Check if user is not logged in and hasn't seen the modal before
    const hasSeenModal = localStorage.getItem("quickRegisterShown");
    const isLoggedIn = localStorage.getItem("accessToken");

    if (!hasSeenModal && !isLoggedIn) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => {
        setShowQuickRegister(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleQuickRegisterSuccess = () => {
    // Redirect to dashboard after successful registration
    window.location.href = "/dashboard";
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-white text-gray-900",
          style: {
            background: "#ffffff",
            color: "#1f2937",
          },
        }}
      />
      <div
        dir="rtl"
        className={`font-sans min-h-screen transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#0E2148] to-[#483AA0]"
            : "bg-[#604bfb]"
        }`}
      >
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/global" element={<Global />} />
              <Route path="/trend" element={<Trend />} />
              <Route path="/trend/:id" element={<Trend />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auctions/:id" element={<Auctions />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/inquiry/:id" element={<Inquiry />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/create-auction" element={<CreateAuction />} />
              <Route path="/create-tender" element={<CreateTender />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>

      {/* Quick Register Modal */}
      <QuickRegisterModal
        isOpen={showQuickRegister}
        onClose={() => setShowQuickRegister(false)}
        onSuccess={handleQuickRegisterSuccess}
      />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
