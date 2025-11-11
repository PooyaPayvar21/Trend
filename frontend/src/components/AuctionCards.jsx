/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const auctions = [
  {
    title: "مزایده فروش زمین کشاورزی",
    id: 1,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "فعال",
    icon: "🏞️",
    desc: "زمین کشاورزی ۵۰۰۰ متری با آب و برق در شمال کشور",
    price: "۲.۵ میلیارد تومان",
    location: "مازندران",
    category: "املاک"
  },
  {
    title: "مزایده فروش خودرو سواری",
    id: 2,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "فعال",
    icon: "🚗",
    desc: "خودروی سواری مدل ۱۳۹۸ کم کارکرد، سالم و تمیز",
    price: "۲۸۰ میلیون تومان",
    location: "تهران",
    category: "خودرو"
  },
  {
    title: "مزایده تجهیزات صنعتی",
    id: 3,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "فعال",
    icon: "🛠️",
    desc: "تجهیزات صنعتی نو و دست دوم، شامل دستگاه های CNC",
    price: "۸۵۰ میلیون تومان",
    location: "اصفهان",
    category: "صنعتی"
  },
  {
    title: "مزایده فروش آپارتمان",
    id: 4,
    date: "۱۴۰۲/۱۲/۱۵",
    deadline: "۱۴۰۲/۱۲/۳۰",
    status: "غیرفعال",
    icon: "🏠",
    desc: "آپارتمان ۳ خوابه ۱۲۰ متری در غرب تهران",
    price: "۴.۲ میلیارد تومان",
    location: "تهران",
    category: "املاک"
  },
  {
    title: "مزایده ماشین آلات کشاورزی",
    id: 5,
    date: "۱۴۰۲/۱۲/۱۸",
    deadline: "۱۴۰۳/۰۱/۰۵",
    status: "فعال",
    icon: "🚜",
    desc: "تراکتور، کمباین و ادوات کشاورزی با کارکرد کم",
    price: "۱.۸ میلیارد تومان",
    location: "خوزستان",
    category: "کشاورزی"
  },
  {
    title: "مزایده تجهیزات پزشکی",
    id: 6,
    date: "۱۴۰۲/۱۲/۲۰",
    deadline: "۱۴۰۳/۰۱/۱۰",
    status: "فعال",
    icon: "🏥",
    desc: "دستگاه های تصویربرداری و تجهیزات کلینیکی نو",
    price: "۳.۵ میلیارد تومان",
    location: "شیراز",
    category: "پزشکی"
  }
];

const CARDS_TO_SHOW = 3;
const SLIDE_INTERVAL = 5000;
const ANIMATION_DURATION = 700;

const AuctionCards = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Simulate loading and error states
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate random error (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('خطا در دریافت اطلاعات مزایده‌ها');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (loading || error) return;
    
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % auctions.length);
        setAnimating(false);
      }, ANIMATION_DURATION);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [loading, error]);

  const handleCardClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Retry loading logic
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const visibleAuctions = [...auctions, ...auctions].slice(
    current,
    current + CARDS_TO_SHOW
  );

  const getStatusColor = (status) => {
    return status === "فعال" 
      ? "bg-green-500/10 text-green-600 border-green-500/20"
      : "bg-red-500/10 text-red-600 border-red-500/20";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "املاک": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "خودرو": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "صنعتی": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "کشاورزی": "bg-green-500/10 text-green-600 border-green-500/20",
      "پزشکی": "bg-pink-500/10 text-pink-600 border-pink-500/20"
    };
    return colors[category] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
  };

  // Loading State
  if (loading) {
    return (
      <div className={`w-full py-16 transition-all duration-500 ${
        isDarkMode ? "bg-gradient-to-br from-[#0E2148] to-[#1a2a5c]" : "bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <LoadingSpinner size="large" text="در حال بارگذاری مزایده‌ها..." />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`w-full py-16 transition-all duration-500 ${
        isDarkMode ? "bg-gradient-to-br from-[#0E2148] to-[#1a2a5c]" : "bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ErrorMessage
              title="خطا در بارگذاری مزایده‌ها"
              message={error}
              onRetry={handleRetry}
              onGoHome={() => navigate('/')}
              type="error"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full py-16 transition-all duration-500 ${
        isDarkMode ? "bg-gradient-to-br from-[#0E2148] to-[#1a2a5c]" : "bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-300 animate-fade-in-up ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            مزایده‌های ویژه
          </h2>
          <p className={`text-lg md:text-xl transition-all duration-300 animate-fade-in-up delay-100 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            جدیدترین مزایده‌های فعال در سراسر کشور
          </p>
        </div>

        {/* Cards Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleAuctions.map((auction, index) => (
              <div
                key={`${auction.id}-${index}`}
                onClick={() => handleCardClick(auction.id)}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl 
                  border border-white/20 overflow-hidden cursor-pointer transition-all duration-700 
                  hover:scale-105 hover:-translate-y-2 ${
                  animating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                  transition-opacity duration-500 bg-gradient-to-br from-purple-500/20 to-blue-500/20`}
                />
                
                <div className="relative p-6 h-full">
                  {/* Header with Icon and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl bg-gradient-to-br from-purple-100 to-blue-100 
                        p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {auction.icon}
                      </div>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                          getStatusColor(auction.status)
                        }`}>
                          {auction.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border ${
                        getCategoryColor(auction.category)
                      }`}>
                        {auction.category}
                      </span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 
                    transition-colors duration-300">
                    {auction.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {auction.desc}
                  </p>

                  {/* Price Section */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 
                    rounded-xl border border-purple-100">
                    <div className="text-sm text-gray-600 mb-1">قیمت پایه:</div>
                    <div className="text-xl font-bold text-purple-700">{auction.price}</div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        📍 موقعیت:
                      </span>
                      <span className="text-gray-700 font-medium">{auction.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        📅 شروع:
                      </span>
                      <span className="text-gray-700 font-medium">{auction.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        ⏰ مهلت:
                      </span>
                      <span className="text-gray-700 font-medium">{auction.deadline}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
                    hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 
                    rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                    transform hover:scale-105 group-hover:shadow-purple-500/25">
                    مشاهده جزئیات مزایده
                  </button>
                </div>

                {/* Hover Overlay with Additional Info */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 to-blue-900/95 
                  flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 
                  transition-all duration-500 backdrop-blur-sm">
                  <div className="text-center text-white space-y-4">
                    <div className="text-2xl mb-2">🔍</div>
                    <h4 className="text-lg font-bold">اطلاعات بیشتر</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>شماره مزایده:</span>
                        <span className="font-bold">{auction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>دسته‌بندی:</span>
                        <span className="font-bold">{auction.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>وضعیت:</span>
                        <span className={`font-bold ${
                          auction.status === "فعال" ? "text-green-300" : "text-red-300"
                        }`}>
                          {auction.status}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="bg-white text-purple-700 px-6 py-2 rounded-lg 
                        font-bold hover:bg-gray-100 transition-colors duration-300">
                        ورود به مزایده
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {auctions.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current 
                    ? "bg-purple-600 scale-125" 
                    : isDarkMode 
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrent(index)}
                aria-label={`اسلاید ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCards;
