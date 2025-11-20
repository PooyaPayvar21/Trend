import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const colors = ["#4fd1c5", "#23264d", "#f6b23c", "#8d8cf8", "#e53e3e", "#38a169"];

const CurrencyRates = () => {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const { default: api } = await import("../api/index");
        const res = await api.get("/currency-rates/");
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        const mapped = data.map((r, i) => ({
          name: r.name || r.code,
          value: new Intl.NumberFormat("fa-IR").format(Number(r.rate || 0)),
          change: (Number(r.change || 0) >= 0 ? "+" : "") + Number(r.change || 0),
          color: colors[i % colors.length],
          up: Number(r.change || 0) >= 0,
        }));
        setRates(mapped);
      } catch (e) {
        console.error(e);
      }
    };
    loadRates();
  }, []);

  useEffect(() => {
    if (rates.length === 0) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rates.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [rates]);

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
    const len = rates.length || 1;
    for (let i = 0; i < Math.min(6, len); i++) {
      const index = (currentIndex + i) % len;
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
      <div className="md:hidden relative h-[140px] overflow-hidden bg-white rounded-xl p-4">
        {rates.length > 0 && (
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
        )}
      </div>

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
