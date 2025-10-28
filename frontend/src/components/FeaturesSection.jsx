import React from "react";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    title: "بررسی‌های مجازی",
    description: "بررسی و مشاهده کالاها به صورت آنلاین.",
    image: "./public/images.jfif",
  },
  {
    title: "مزایده‌های خودرو",
    description: "شرکت در مزایده‌های خودروهای مختلف.",
    image: "./public/images.jfif",
  },
  {
    title: "مزایده‌های وسایل و ساعت",
    description: "دسترسی به مزایده‌های وسایل لوکس و ساعت.",
    image: "./public/images.jfif",
  },
  {
    title: "مزایده‌های رویدادهای صنعتی",
    description: "شرکت در مزایده‌های تجهیزات و رویدادهای صنعتی.",
    image: "./public/images.jfif",
  },
  {
    title: "مزایده‌های ملک",
    description: "خرید و فروش املاک از طریق مزایده.",
    image: "./public/images.jfif",
  },
  {
    title: "ثبت قرارداد برای ایران",
    description: "امکان ثبت و مشاهده قراردادها.",
    image: "./public/images.jfif",
  },
];

const FeaturesSection = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <section className={`py-6 rounded-lg transition-all duration-300 ${
      isDarkMode ? "bg-[#f5f5f5]" : "bg-[#604bfb]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 ${
            isDarkMode ? "text-[#0E2148]" : "text-white"
          }`}>
            مناقصه های ویژه
          </h2>
          <p className={`text-sm md:text-base transition-all duration-300 ${
            isDarkMode ? "text-gray-600" : "text-white"
          }`}>
            دسترسی به جدیدترین مناقصه‌های فعال در سراسر کشور
          </p>
        </div>
        <div
          className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-6 md:overflow-x-visible"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative min-w-[280px] md:min-w-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex-shrink-0 md:flex-shrink group cursor-pointer"
              style={{ height: "180px" }}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover rounded-2xl transition-all duration-300 group-hover:blur-sm"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-2xl p-4">
                <h3 className="text-base font-semibold text-white mb-2 drop-shadow text-center">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-100 text-center drop-shadow">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
