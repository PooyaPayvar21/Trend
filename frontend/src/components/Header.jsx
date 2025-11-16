import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
  FaBell,
  FaHome,
  FaHammer,
  FaPlusCircle,
  FaUserShield,
  FaGavel,
  FaFileAlt,
} from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: "/", label: "صفحه اصلی", icon: FaHome },
    { path: "/auctions", label: "مزایده‌", icon: FaGavel },
    { path: "/trend", label: "مناقصه", icon: FaFileAlt },
  ];

  const adminItems = [
    { path: "/admin", label: "پنل مدیریت", icon: FaUserShield },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? "bg-slate-900/95 backdrop-blur-md shadow-2xl border-b border-slate-700/50"
            : "bg-white/95 backdrop-blur-md shadow-2xl border-b border-gray-200/50"
          : isDarkMode
          ? "bg-transparent"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-3 text-2xl font-bold transition-all duration-300 ${
              isDarkMode
                ? "text-white hover:text-purple-300"
                : "text-gray-900 hover:text-purple-600"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg"
              }`}
            >
              ⚡
            </div>
            <span className="hidden sm:block">مزایده هوشمند</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 mr-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath(item.path)
                      ? isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user?.is_admin &&
              adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActivePath(item.path)
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        : isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی مزایده‌ها..."
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 ${
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
                    : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
                }`}
              />
              <button
                type="submit"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-purple-400"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                <FaSearch className="text-lg" />
              </button>
            </form>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigation("/notifications")}
                  className={`p-3 rounded-xl transition-all duration-300 relative ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaBell className="text-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </button>

                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaTachometerAlt className="text-sm" />
                  <span>داشبورد</span>
                </button>

                <div className="relative group">
                  <button
                    className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <FaUserCircle className="text-2xl" />
                  </button>

                  <div
                    className={`absolute top-full right-0 mt-2 w-48 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                      isDarkMode
                        ? "bg-slate-800 border border-slate-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="p-4">
                      <div
                        className={`text-sm font-medium mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.email}
                      </div>
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                          isDarkMode
                            ? "text-gray-300 hover:text-white hover:bg-white/10"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <FaUser className="text-sm" />
                        <span>پروفایل</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 mt-2 ${
                          isDarkMode
                            ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            : "text-red-600 hover:text-red-700 hover:bg-red-50"
                        }`}
                      >
                        <FaSignOutAlt className="text-sm" />
                        <span>خروج</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigation("/login")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaSignInAlt className="text-sm" />
                  <span>ورود</span>
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>ثبت نام</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:bg-white/10"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {isMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100 py-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی مزایده‌ها..."
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 ${
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
                    : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
                }`}
              />
              <button
                type="submit"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-purple-400"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                <FaSearch className="text-lg" />
              </button>
            </div>
          </form>

          {/* Mobile Navigation */}
          <nav className="space-y-2 mb-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActivePath(item.path)
                      ? isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user?.is_admin &&
              adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActivePath(item.path)
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </nav>

          {/* Mobile User Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <ThemeToggle />
              {user && (
                <button
                  onClick={() => handleNavigation("/notifications")}
                  className={`p-3 rounded-xl transition-all duration-300 relative ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaBell className="text-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </button>
              )}
            </div>

            {user ? (
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-xl mb-4 ${
                    isDarkMode ? "bg-slate-800/50" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaTachometerAlt className="text-lg" />
                  <span>داشبورد</span>
                </button>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span>پروفایل</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      : "text-red-600 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigation("/login")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FaSignInAlt className="text-lg" />
                  <span>ورود</span>
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <span>ثبت نام</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
