import React from "react";
import { Link } from "react-router-dom";
import { FaGavel, FaFileAlt, FaPlus } from "react-icons/fa";
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

  return (
    <div
      dir="rtl"
      className={`font-sans min-h-screen rounded-2xl transition-all duration-300 ${
        isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
      }`}
    >
      <HeroSection />
      <div className="container mx-auto px-4">
        <AuctionCards />
        <FeaturesSection />

        <div className="my-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                دسترسی سریع
              </h2>
              <p className="text-gray-300 text-lg">
                مزایده یا مناقصه جدید ایجاد کنید
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                to="/create-auction"
                className="group bg-gradient-to-r from-[#E3D095] to-[#E3D095]/80 hover:from-[#E3D095]/90 hover:to-[#E3D095]/70 text-black font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-4"
              >
                <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/30 transition-colors">
                  <FaGavel size={24} />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">ایجاد مزایده</div>
                  <div className="text-sm opacity-80">فروش کالا یا خدمت</div>
                </div>
                <FaPlus className="mr-auto opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                to="/create-tender"
                className="group bg-gradient-to-r from-[#E3D095] to-[#E3D095]/80 hover:from-[#E3D095]/90 hover:to-[#E3D095]/70 text-black font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-4"
              >
                <div className="p-3 bg-black/20 rounded-full group-hover:bg-black/30 transition-colors">
                  <FaFileAlt size={24} />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">ایجاد مناقصه</div>
                  <div className="text-sm opacity-80">درخواست کالا یا خدمت</div>
                </div>
                <FaPlus className="mr-auto opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

        <div className="my-12" />
        <NonMetalScrapPrices />
        <CurrencyRates />
        <AuctionTrendCharts />
        <ConsultationSection />
      </div>
    </div>
  );
};

export default Home;
