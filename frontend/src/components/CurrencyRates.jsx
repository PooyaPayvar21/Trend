import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const rates = [
  {
    name: "دلار",
    value: "58,000",
    change: "+1.2%",
    color: "#4fd1c5",
    up: true,
  },
  {
    name: "یورو",
    value: "62,500",
    change: "-0.8%",
    color: "#23264d",
    up: false,
  },
  {
    name: "درهم",
    value: "15,800",
    change: "+0.5%",
    color: "#f6b23c",
    up: true,
  },
  {
    name: "لیر",
    value: "1,850",
    change: "-1.5%",
    color: "#8d8cf8",
    up: false,
  },
  {
    name: "اتریوم",
    value: "1,850",
    change: "-1.5%",
    color: "#8d8cf8",
    up: false,
  },
];

const CurrencyRates = () => {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rates.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const getVisibleRates = () => {
    const visibleRates = [];
    for (let i = 0; i < 6; i++) {
      const index = (currentIndex + i) % rates.length;
      visibleRates.push(rates[index]);
    }
    return visibleRates;
  };

  return (
    <section
      className={`rounded-2xl shadow-soft p-4 md:p-6 mb-6 md:mb-8 transition-all duration-300 ${
        isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
      }`}
    >
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
        نرخ ارز
      </h2>
      {/* Mobile View */}
      <div className="md:hidden relative h-[140px] overflow-hidden bg-white rounded-xl p-4">
        <div
          className={`absolute w-full transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rates[currentIndex].color }}
              ></span>
              <h3 className="text-base font-semibold text-[#0E2148]">
                {rates[currentIndex].name}
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#0E2148] mb-2">
                {rates[currentIndex].value}
              </span>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  rates[currentIndex].up ? "text-green-500" : "text-red-500"
                }`}
              >
                {rates[currentIndex].up ? (
                  <FaArrowUp className="w-4 h-4" />
                ) : (
                  <FaArrowDown className="w-4 h-4" />
                )}
                {rates[currentIndex].change}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-3">
          {getVisibleRates().map((rate, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-xl p-3 transition-all duration-300 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: rate.color }}
                  ></span>
                  <h3 className="text-base font-semibold text-[#0E2148]">
                    {rate.name}
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-[#0E2148] mb-1">
                    {rate.value}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-sm font-medium ${
                      rate.up ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {rate.up ? (
                      <FaArrowUp className="w-3 h-3" />
                    ) : (
                      <FaArrowDown className="w-3 h-3" />
                    )}
                    {rate.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {rates.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all duration-200 ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default CurrencyRates;
