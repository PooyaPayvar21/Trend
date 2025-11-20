import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "./LoadingSpinner";

const slides = [
  {
    title: "مزایده‌های هوشمند و شفاف",
    description:
      "با استفاده از فناوری بلاکچین، در مزایده‌هایی کاملاً شفاف و امن شرکت کنید",
    image: "🎯",
    bgGradient: "from-purple-600 via-blue-600 to-indigo-600",
    accentColor: "text-purple-200",
    buttonGradient:
      "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
  },
  {
    title: "دسترسی به فرصت‌های سرمایه‌گذاری",
    description:
      "از طریق پلتفرم ما به بهترین فرصت‌های سرمایه‌گذاری و مزایده‌های دولتی و خصوصی دسترسی پیدا کنید",
    image: "💎",
    bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentColor: "text-emerald-200",
    buttonGradient:
      "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
  },
  {
    title: "سیستм اعلانات هوشمند",
    description:
      "با سیستم اعلانات هوشمند ما، از جدیدترین مزایده‌ها و فرصت‌ها در لحظه با خبر شوید",
    image: "🔔",
    bgGradient: "from-orange-600 via-red-600 to-pink-600",
    accentColor: "text-orange-200",
    buttonGradient:
      "from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
  },
];

const SLIDE_INTERVAL = 6000;
const ANIMATION_DURATION = 800;

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Simulate loading state
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, ANIMATION_DURATION / 2);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSlideChange = (index) => {
    if (index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, ANIMATION_DURATION / 2);
  };

  const handleGetStarted = () => {
    navigate("/register");
  };

  const currentSlideData = slides[currentSlide];

  // Loading State
  if (loading) {
    return (
      <section
        className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
            : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-pulse transition-all duration-1000 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-500 to-blue-500"
                : "bg-gradient-to-br from-purple-400 to-blue-400"
            }`}
          />
          <div
            className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-pulse transition-all duration-1000 delay-1000 ${
              isDarkMode
                ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                : "bg-gradient-to-br from-emerald-400 to-teal-400"
            }`}
          />
        </div>

        <div className="relative z-10 text-center">
          <LoadingSpinner size="large" text="در حال بارگذاری..." />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden transition-all duration-1000 rounded-2xl${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-pulse transition-all duration-1000 ${
            isDarkMode
              ? "bg-gradient-to-br from-purple-500 to-blue-500"
              : "bg-gradient-to-br from-purple-400 to-blue-400"
          }`}
        />
        <div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-pulse transition-all duration-1000 delay-1000 ${
            isDarkMode
              ? "bg-gradient-to-br from-emerald-500 to-teal-500"
              : "bg-gradient-to-br from-emerald-400 to-teal-400"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5 animate-spin transition-all duration-1000 ${
            isDarkMode
              ? "bg-gradient-to-br from-orange-500 to-red-500"
              : "bg-gradient-to-br from-orange-400 to-red-400"
          }`}
          style={{ animationDuration: "20s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content Side */}
          <div className="text-center lg:text-right space-y-8">
            {/* Slide Content */}
            <div
              className={`transition-all duration-${ANIMATION_DURATION} transform ${
                isAnimating
                  ? "opacity-0 translate-y-8"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {/* Icon */}
              <div
                className={`text-8xl mb-6 animate-bounce transition-all duration-1000 ${currentSlideData.accentColor}`}
              >
                {currentSlideData.image}
              </div>

              {/* Title */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-1000 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span
                  className={`bg-gradient-to-r bg-clip-text text-transparent animate-gradient bg-300 ${currentSlideData.bgGradient}`}
                >
                  {currentSlideData.title}
                </span>
              </h1>

              {/* Description */}
              <p
                className={`text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed transition-all duration-1000 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {currentSlideData.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl group relative overflow-hidden ${currentSlideData.buttonGradient}`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    شروع کنید
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>

                <button
                  onClick={() => navigate("/auctions")}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden ${
                    isDarkMode
                      ? "border-gray-600 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    مشاهده مزایده‌ها
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      ←
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center lg:justify-start gap-3 pt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? `bg-gradient-to-r ${currentSlideData.bgGradient} scale-125`
                      : isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`اسلاید ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            {/* Main Visual Card */}
            <div
              className={`relative transition-all duration-${ANIMATION_DURATION} transform ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div
                className={`bg-gradient-to-br ${currentSlideData.bgGradient} p-8 rounded-3xl shadow-2xl 
                transform hover:scale-105 transition-transform duration-500 relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                </div>

                <div className="relative z-10 text-center text-white space-y-6">
                  <div className="text-9xl mb-4 animate-pulse">
                    {currentSlideData.image}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {currentSlideData.title}
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {currentSlideData.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 justify-center mt-6">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      ✅ امن و شفاف
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      ⚡ سریع و آسان
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      📱 در دسترس همیشگی
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl animate-bounce shadow-lg">
              ✨
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-xl animate-pulse shadow-lg">
              🚀
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div
          className={`w-6 h-10 border-2 rounded-full flex justify-center transition-all duration-1000 ${
            isDarkMode ? "border-white" : "border-gray-800"
          }`}
        >
          <div
            className={`w-1 h-3 rounded-full mt-2 transition-all duration-1000 ${
              isDarkMode ? "bg-white" : "bg-gray-800"
            }`}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
