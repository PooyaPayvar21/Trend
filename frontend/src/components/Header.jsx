import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaHome,
  FaGavel,
  FaFileAlt,
  FaSearch,
  FaGlobe,
  FaTags,
  FaIndustry,
  FaGlobeAmericas,
  FaChartBar,
  FaNewspaper,
  FaPhone,
  FaHandshake,
  FaCog,
} from "react-icons/fa";
import MobileNavSlider from "./MobileNavSlider";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";
import { BiSupport } from "react-icons/bi";

const navItems = [
  { to: "/", label: "صفحه نخست", icon: FaHome },
  { to: "/auctions", label: "مزایده", icon: FaGavel },
  { to: "/trend", label: "مناقصه", icon: FaFileAlt },
  { to: "/inquiry", label: "استعلام", icon: FaSearch },
  { to: "/global", label: "تهیه اسناد منقصه", icon: FaGlobe },
  { to: "/categories", label: "انتشار آگهی", icon: FaTags },
  { to: "/insidemarket", label: "بازارهای داخلی", icon: FaIndustry },
  { to: "/outsidemarket", label: "بازارهای خارجی", icon: FaGlobeAmericas },
  { to: "/datanalysis", label: "تحلیل داده ها", icon: FaChartBar },
  { to: "/news", label: "اخبار و قوانین", icon: FaNewspaper },
  { to: "/contact", label: "تماس با ما", icon: FaPhone },
  // { to: "/cooperation", label: "همکاری با ما", icon: FaHandshake },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("auction");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();

  // Determine the destination based on user login status
  const getAuthDestination = () => {
    return user ? "/dashboard" : "/login";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return "ع";
    return user.username.charAt(0).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    logout();
    toast.success("خروج موفقیت‌آمیز");
    setShowLogoutConfirm(false);
    // navigate('/') is now handled in AuthContext
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header
      className={`shadow-soft border-b transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0E2148] to-[#483AA0] border-[#E3D095]/30"
          : "bg-gradient-to-br from-[#604bfb] to-[#7c5cfb] border-white/20"
      }`}
      dir="rtl"
    >
      {/* Top Header */}
      <div className="container mx-auto px-4">
        {/* Mobile: Flex row, logo left, search center, icons right */}
        <div className="flex justify-between items-center h-20 md:h-20">
          {/* Left: Logo or Site Name */}
          <div className="flex items-center gap-2">
            {/* Show site name 'جدید' on mobile, hide on desktop */}
            <Link
              to="/"
              className="md:hidden font-bold text-lg text-white cursor-pointer"
            >
              جدید
            </Link>
          </div>
          {/* Mobile Search Bar - between logo and icons */}
          <div className="flex-1 md:hidden px-2">
            <div className="flex items-center w-full">
              <select
                className="bg-[#1a2a5c] text-white border-none rounded-l px-2 py-2 text-sm focus:ring-2 focus:ring-[#1a2a5c]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="auction">مزایده</option>
                <option value="trade">تجارت</option>
              </select>
              <input
                type="text"
                className="bg-[#1a2a5c] text-white border-none px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E3D095]"
                placeholder="کلمه کلیدی یا شماره مناقصه..."
              />
            </div>
          </div>
          {/* Right: Icons */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="relative group">
              <button
                className="focus:outline-none cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Open menu"
              >
                <span className="text-2xl text-[#E3D095]">&#9776;</span>
              </button>
              <span className="absolute bottom-[-2.2rem] right-1/2 translate-x-1/2 bg-[#23264d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                منو
              </span>
            </div>
            <div className="relative group">
              <Link
                to={getAuthDestination()}
                className="text-[#E3D095] hover:text-[#e3d095]/90 transition-colors duration-200"
              >
                {user ? (
                  <div className="w-6 h-6 rounded-full bg-[#E3D095] text-[#0E2148] flex items-center justify-center text-sm font-bold">
                    {getUserInitials()}
                  </div>
                ) : (
                  <FaUser size={18} />
                )}
              </Link>
              <span className="absolute bottom-[-2.2rem] right-1/2 translate-x-1/2 bg-[#23264d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {user ? "داشبورد" : "ورود / ثبت نام"}
              </span>
            </div>
            {user && (
              <div className="relative group">
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <FaSignOutAlt size={18} />
                </button>
                <span className="absolute bottom-[-2.2rem] right-1/2 translate-x-1/2 bg-[#23264d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  خروج
                </span>
              </div>
            )}
            <div className="relative group">
              <Link
                to="/cart"
                className="text-[#E3D095] hover:text-[#e3d095]/90 transition-colors duration-200"
              >
                <FaShoppingCart size={18} />
              </Link>
              <span className="absolute bottom-[-2.2rem] right-1/2 translate-x-1/2 bg-[#23264d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                سبد خرید
              </span>
            </div>
            <div className="relative group">
              <ThemeToggle />
              <span className="absolute bottom-[-2.2rem] right-1/2 translate-x-1/2 bg-[#23264d] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                تغییر تم
              </span>
            </div>
          </div>

          {/* Desktop: Site Name and Search Bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col ml-2">
              <span className="font-bold text-lg text-white">جدید</span>
              <span className="text-xs text-[#E3D095]">ENHANCING BUSINESS</span>
            </div>
            <div className="flex items-center w-[900px] mx-4">
              <div
                className={`flex items-stretch w-full rounded-full shadow-md transition-all duration-300 border focus-within:ring-2 focus-within:ring-[#604bfb] ${
                  isDarkMode
                    ? "bg-[#1a2a5c] border-[#23264d]"
                    : "bg-white border-gray-200"
                }`}
              >
                <select
                  className={`rounded-r-full px-4 py-2 text-sm border-none outline-none transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#1a2a5c] text-white focus:ring-[#1a2a5c]"
                      : "bg-white text-[#1a2a5c] focus:ring-[#604bfb]"
                  }`}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="auction">مزایده</option>
                  <option value="trade">مناقصه</option>
                </select>
                <div className="relative flex-1">
                  <input
                    type="text"
                    className={`w-full px-4 py-2 text-sm border-none outline-none bg-transparent rounded-none rounded-l-full transition-all duration-300 placeholder-gray-400 ${
                      isDarkMode
                        ? "text-white placeholder-gray-400"
                        : "text-[#1a2a5c] placeholder-gray-500"
                    }`}
                    placeholder="کلمه کلیدی یا شماره مناقصه..."
                  />
                  <span
                    className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                      isDarkMode ? "text-[#E3D095]" : "text-[#604bfb]"
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <button className="ml-3 bg-[#E3D095] cursor-pointer text-[#0E2148] px-5 py-2 rounded-full font-bold hover:bg-[#e3d095]/90 transition-colors duration-200 shadow-md">
                جستجو
              </button>
            </div>
          </div>
          {/* Right: Contact, Login (desktop only) */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <span className="bg-[#E3D095] hover:bg-[#e3d095]/90 text-[#0E2148] px-4 py-2 rounded-lg shadow-soft transition-colors duration-200 font-bold">
              <Link to={"/support"}>
                <BiSupport className="text-2xl w-full" />
              </Link>
            </span>
            <Link
              to={getAuthDestination()}
              className="bg-[#E3D095] hover:bg-[#e3d095]/90 text-[#0E2148] px-4 py-2 rounded-lg shadow-soft transition-colors duration-200 font-bold"
            >
              {user ? (
                <div
                  className={`w-8 h-8 rounded-full text-[#E3D095] flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
                  }`}
                >
                  {getUserInitials()}
                </div>
              ) : (
                <IoPersonCircleSharp className="text-2xl w-full" />
              )}
            </Link>
            {user && user.is_staff && (
              <Link
                to="/admin"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-soft transition-colors duration-200 font-bold flex items-center gap-2"
              >
                <FaCog size={16} />
                <span className="hidden lg:inline">ادمین</span>
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-soft transition-colors duration-200 font-bold flex items-center gap-2"
              >
                <FaSignOutAlt size={16} />
                <span className="hidden lg:inline">خروج</span>
              </button>
            )}
          </div>
        </div>
        {/* Mobile Nav Slider: under filter and icons, only on mobile */}
        <MobileNavSlider />
      </div>

      {/* Navigation Bar - Hidden on mobile */}
      <nav
        className={`hidden md:block border-t transition-all duration-300 ${
          isDarkMode
            ? "bg-[#0E2148]/80 border-[#E3D095]/30"
            : "bg-[#604bfb]/80 border-white/20"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-wrap justify-center py-3 gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-gradient-to-r from-[#E3D095] to-[#E3D095]/90 text-[#0E2148] font-bold shadow-lg shadow-[#E3D095]/25"
                      : isDarkMode
                      ? "text-white hover:text-[#E3D095] hover:bg-[#E3D095]/10 hover:shadow-md hover:shadow-[#E3D095]/20"
                      : "text-white hover:text-[#E3D095] hover:bg-white/20 hover:shadow-md hover:shadow-white/20"
                  }`
                }
              >
                <IconComponent
                  size={16}
                  className="transition-all duration-300 group-hover:scale-110"
                />
                <span className="relative">
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isDarkMode ? "bg-[#E3D095]" : "bg-[#604bfb]"
                    }`}
                  ></span>
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[280px] z-50 transform transition-all duration-300 ease-in-out md:hidden ${
          isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
        } ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#E3D095]/30">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-[#E3D095] hover:text-[#e3d095]/90 transition-colors duration-200"
          >
            <span className="text-2xl cursor-pointer">×</span>
          </button>
          <span className="text-[#E3D095] font-bold">منو</span>
        </div>
        <div className="flex flex-col py-2 gap-2 text-sm font-medium overflow-y-auto h-[calc(100%-60px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-all duration-200 px-4 py-3 transform hover:translate-x-[-4px] ${
                  isActive
                    ? "bg-[#E3D095] text-[#0E2148] font-bold"
                    : "text-white hover:text-[#E3D095] hover:bg-[#E3D095]/10"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to={getAuthDestination()}
            className="bg-[#E3D095] hover:bg-[#e3d095]/90 text-[#0E2148] px-4 py-3 rounded-lg shadow-soft transition-all duration-200 font-bold text-center mx-4 mt-2 transform hover:scale-[1.02]"
            onClick={() => setMenuOpen(false)}
          >
            {user ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full text-[#E3D095] flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
                  }`}
                >
                  {getUserInitials()}
                </div>
                <span>داشبورد</span>
              </div>
            ) : (
              <IoPersonCircleSharp />
            )}
          </Link>
          {user && user.is_staff && (
            <Link
              to="/admin"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg shadow-soft transition-all duration-200 font-bold text-center mx-4 mt-2 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <FaCog size={16} />
              <span>ادمین</span>
            </Link>
          )}
          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg shadow-soft transition-all duration-200 font-bold text-center mx-4 mt-2 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaSignOutAlt size={16} />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={cancelLogout}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <FaSignOutAlt className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  تایید خروج
                </h3>
                <p className="text-sm text-gray-500">
                  آیا مطمئن هستید که می‌خواهید خارج شوید؟
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                انصراف
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
