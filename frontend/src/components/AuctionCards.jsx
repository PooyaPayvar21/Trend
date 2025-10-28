/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const auctions = [
  {
    title: "مزایده فروش زمین",
    id: 1,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "فعال",
    icon: "🏞️",
    desc: "زمین کشاورزی ۵۰۰۰ متری در شمال کشور",
  },
  {
    title: "مزایده فروش خودرو",
    id: 2,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "فعال",
    icon: "🚗",
    desc: "خودروی سواری مدل ۱۳۹۸ کم کارکرد",
  },
  {
    title: "مزایده فروش تجهیزات",
    id: 3,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "فعال",
    icon: "🛠️",
    desc: "تجهیزات صنعتی نو و دست دوم",
  },
  {
    title: "مزایده فروش ملک",
    id: 4,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "غیرفعال",
    icon: "🏠",
    desc: "آپارتمان ۳ خوابه در تهران",
  },
];

const CARDS_TO_SHOW = 3;
const SLIDE_INTERVAL = 5000;
const ANIMATION_DURATION = 700;

const AuctionCards = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % auctions.length);
        setAnimating(false);
      }, ANIMATION_DURATION);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };

  const visibleAuctions = [...auctions, ...auctions].slice(
    current,
    current + CARDS_TO_SHOW
  );

  return (
    <div className={`w-full py-12 transition-all duration-300 ${
      isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 ${
            isDarkMode ? "text-white" : "text-white"
          }`}>
            مزایده های ویژه
          </h2>
          <p className={`transition-all duration-300 ${
            isDarkMode ? "text-white" : "text-white"
          }`}>جدیدترین مزایده های فعال در سراسر کشور</p>
        </div>
        <div className="relative">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {visibleAuctions.map((a, i) => (
              <div
                key={i}
                onClick={() => handleCardClick(a.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group relative h-full"
              >
                <div className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{a.icon}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        a.status === "فعال"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{a.desc}</p>
                  <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                    <span>تاریخ: {a.date}</span>
                    <span>مهلت: {a.deadline}</span>
                  </div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                  <div className="text-center w-full">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>تاریخ شروع:</span>
                        <span>{a.date}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>مهلت پایان:</span>
                        <span>{a.deadline}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>شماره مزایده:</span>
                        <span>{a.id}</span>
                      </div>
                    </div>
                    <button className={`mt-4 cursor-pointer px-4 py-1.5 text-white rounded-full font-medium transition-colors duration-300 text-sm ${
                      isDarkMode ? "bg-[#0E2148] hover:bg-[#1a2d5a]" : "bg-[#604bfb] hover:bg-[#7c5cfb]"
                    }`}>
                      مشاهده جزئیات
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {auctions.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === current ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrent(i)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCards;
