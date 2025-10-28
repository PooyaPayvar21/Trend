import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const getSlides = (isDarkMode) => [
  {
    bg: isDarkMode ? "from-[#0E2148] to-[#483AA0]" : "from-[#604bfb] to-[#7c5cfb]",
    title: "مزایده های سراسر کشور",
    desc: "در یک پلتفرم، بهترین مزایده‌ها و مناقصه‌ها را از سراسر کشور پیدا کنید.",
    btn: "مشاهده مزایده‌ها",
  },
  {
    bg: isDarkMode ? "from-[#483AA0] to-[#7965C1]" : "from-[#7c5cfb] to-[#8f6cfb]",
    title: "فرصت‌های ویژه برای خریداران و فروشندگان",
    desc: "با ما، معاملات خود را سریع‌تر و مطمئن‌تر انجام دهید.",
    btn: "ثبت نام رایگان",
  },
  {
    bg: isDarkMode ? "from-[#7965C1] to-[#E3D095]" : "from-[#8f6cfb] to-[#a17cfb]",
    title: "تحلیل و مشاوره اقتصادی رایگان",
    desc: "از مشاوره و تحلیل‌های تخصصی ما برای تصمیم‌گیری بهتر بهره‌مند شوید.",
    btn: "دریافت مشاوره",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const { isDarkMode } = useTheme();

  const slides = getSlides(isDarkMode);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section
      className={`relative w-full min-h-[280px] sm:min-h-[340px] md:min-h-[420px] flex items-center justify-center bg-gradient-to-b ${slides[current].bg} text-white text-center py-12 md:py-20 px-4 transition-colors duration-700 overflow-hidden rounded`}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg">
          {slides[current].title}
        </h1>
        <p className="text-base sm:text-lg md:text-2xl mb-4 md:mb-6 drop-shadow px-2">
          {slides[current].desc}
        </p>
        <button className="cursor-pointer mt-2 md:mt-4 bg-[#E3D095] hover:bg-[#E3D095]/90 text-[#0E2148] font-bold px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg transition-all duration-200 text-base md:text-lg">
          {slides[current].btn}
        </button>
      </div>
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full inline-block transition-all duration-300 border-2 border-white ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
            onClick={() => setCurrent(i)}
            style={{ cursor: "pointer" }}
            aria-label={`اسلاید ${i + 1}`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
