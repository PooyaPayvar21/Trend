/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const QuickRegisterModal = ({ isOpen, onClose, onSuccess }) => {
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate username from email
  useEffect(() => {
    if (formData.email && !formData.username) {
      const username = formData.email.split("@")[0];
      setFormData((prev) => ({ ...prev, username }));
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("رمزهای عبور مطابقت ندارند");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("رمز عبور باید حداقل 6 کاراکتر باشد");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };

      await register(userData);
      toast.success(
        "ثبت‌نام موفقیت‌آمیز! لطفا اطلاعات تکمیلی را در داشبورد وارد کنید."
      );
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.detail || "خطا در ثبت‌نام. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
    // Store in localStorage that user has seen the modal
    localStorage.setItem("quickRegisterShown", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
            isDarkMode ? "from-[#0E2148] to-[#483AA0]" : "from-[#604bfb] to-[#7c5cfb]"
          }`}>
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ثبت‌نام سریع
          </h2>
          <p className="text-gray-600">در کمتر از 30 ثانیه عضو شوید</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام کاربری
            </label>
            <div className="relative">
              <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E2148] focus:border-transparent"
                placeholder="نام کاربری"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ایمیل
            </label>
            <div className="relative">
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E2148] focus:border-transparent"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E2148] focus:border-transparent"
                placeholder="حداقل 6 کاراکتر"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تکرار رمز عبور
            </label>
            <div className="relative">
              <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E2148] focus:border-transparent"
                placeholder="تکرار رمز عبور"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-200 ${
                isDarkMode 
                  ? "bg-gradient-to-r from-[#0E2148] to-[#483AA0] hover:from-[#0E2148]/90 hover:to-[#483AA0]/90" 
                  : "bg-gradient-to-r from-[#604bfb] to-[#7c5cfb] hover:from-[#604bfb]/90 hover:to-[#7c5cfb]/90"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام سریع"}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              بعداً ثبت‌نام می‌کنم
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            با ثبت‌نام، شما با{" "}
            <span className={`font-medium transition-all duration-300 ${
              isDarkMode ? "text-[#0E2148]" : "text-[#604bfb]"
            }`}>شرایط استفاده</span> و{" "}
            <span className={`font-medium transition-all duration-300 ${
              isDarkMode ? "text-[#0E2148]" : "text-[#604bfb]"
            }`}>حریم خصوصی</span>{" "}
            موافقت می‌کنید
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickRegisterModal;
