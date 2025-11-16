import React from "react";
import { Link } from "react-router-dom";
import {
  FaGavel,
  FaFileAlt,
  FaPlus,
  FaChartLine,
  FaHandshake,
  FaShieldAlt,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import HeroSection from "../components/HeroSection";
import AuctionCards from "../components/AuctionCards";
import FeaturesSection from "../components/FeaturesSection";
import CurrencyRates from "../components/CurrencyRates";
import NonMetalScrapPrices from "../components/NonMetalScrapPrices";
import AuctionTrendCharts from "../components/AuctionTrendCharts";
import ConsultationSection from "../components/ConsultationSection";

const Home = () => {
  const { isDarkMode } = useTheme();

  const quickActions = [
    {
      title: "ایجاد مزایده",
      subtitle: "فروش کالا یا خدمت",
      icon: FaGavel,
      path: "/create-auction",
      gradient: "from-amber-500 to-orange-500",
      hoverGradient: "from-amber-600 to-orange-600",
    },
    {
      title: "ایجاد مناقصه",
      subtitle: "درخواست کالا یا خدمت",
      icon: FaFileAlt,
      path: "/create-tender",
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "from-blue-600 to-cyan-600",
    },
  ];

  const stats = [
    { number: "۱۲۵۰+", label: "مزایده فعال", icon: FaChartLine },
    { number: "۸۹۰+", label: "مناقصه فعال", icon: FaHandshake },
    { number: "۹۸%", label: "رضایت مشتری", icon: FaShieldAlt },
  ];

  return (
    <div
      dir="rtl"
      className={`font-sans min-h-screen transition-all duration-300 ease-in-out ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
    >
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-white/5 border border-white/10"
                      : "bg-white/80 border border-white/20 shadow-xl"
                  }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                        : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                    }`}
                  >
                    <Icon />
                  </div>
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Auction Cards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AuctionCards />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div
            className={`rounded-3xl p-12 backdrop-blur-sm border transition-all duration-300 ${
              isDarkMode
                ? "bg-white/5 border-white/10"
                : "bg-white/80 border-white/20 shadow-2xl"
            }`}
          >
            <div className="text-center mb-12">
              <h2
                className={`text-4xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                دسترسی سریع
              </h2>
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                مزایده یا مناقصه جدید ایجاد کنید
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className={`group relative overflow-hidden bg-gradient-to-br ${action.gradient} hover:${action.hoverGradient} text-white font-bold py-8 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center justify-between`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                          <Icon size={28} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {action.title}
                          </div>
                          <div className="text-sm opacity-90">
                            {action.subtitle}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <FaPlus className="text-2xl opacity-70 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-90" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FeaturesSection />
        </div>
      </section>

      {/* Market Data Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 shadow-2xl">
            {/* <div
              className={`rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 flex justify-center items-center ${
                isDarkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white/80 border-white/20 shadow-xl"
              }`}
            >
              <CurrencyRates />
            </div> */}
            <div
              className={`rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 ${
                isDarkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white/80 border-white/20 shadow-xl"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-6 text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                قیمت ضایعات فلزی
              </h3>
              <NonMetalScrapPrices />
            </div>
          </div>

          <div
            className={`rounded-2xl p-8 backdrop-blur-sm shadow-2xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-white/5 border-white/10"
                : "bg-white/80 border-white/20 shadow-xl"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-6 text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              تحلیل روند مزایده‌ها
            </h3>
            <AuctionTrendCharts />
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ConsultationSection />
        </div>
      </section>
    </div>
  );
};

export default Home;
