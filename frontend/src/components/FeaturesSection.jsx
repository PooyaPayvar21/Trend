import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaGavel, FaCar, FaGem, FaIndustry, FaHome, FaFileContract } from 'react-icons/fa';

const features = [
  {
    title: "بررسی‌های مجازی",
    description: "بررسی و مشاهده کالاها به صورت آنلاین با کیفیت بالا",
    icon: FaGavel,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    title: "مزایده‌های خودرو",
    description: "شرکت در مزایده‌های خودروهای مختلف با ضمانت",
    icon: FaCar,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600"
  },
  {
    title: "مزایده‌های وسایل و ساعت",
    description: "دسترسی به مزایده‌های وسایل لوکس و ساعتهای گرانقیمت",
    icon: FaGem,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    title: "مزایده‌های رویدادهای صنعتی",
    description: "شرکت در مزایده‌های تجهیزات و رویدادهای صنعتی",
    icon: FaIndustry,
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600"
  },
  {
    title: "مزایده‌های ملک",
    description: "خرید و فروش املاک از طریق مزایده با مشاوره تخصصی",
    icon: FaHome,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600"
  },
  {
    title: "ثبت قرارداد برای ایران",
    description: "امکان ثبت و مشاهده قراردادها با امنیت بالا",
    icon: FaFileContract,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600"
  },
];

const FeaturesSection = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <section className={`py-16 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full mb-6 ${
            isDarkMode 
              ? 'bg-blue-900/50 text-blue-300' 
              : 'bg-blue-100 text-blue-600'
          }`}>
            <span className="text-sm font-medium">خدمات برتر</span>
            <span>⭐</span>
          </div>
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 transition-all duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            مناقصه‌های ویژه
          </h2>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            دسترسی به جدیدترین مناقصه‌های فعال در سراسر کشور با بالاترین استانداردهای امنیتی و کیفیتی
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700 hover:border-blue-500' 
                    : 'bg-white border border-gray-200 hover:border-blue-500'
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white' 
                      : `${feature.bgColor} ${feature.textColor}`
                  }`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-6 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                  
                  {/* Action Button */}
                  <button className={`inline-flex items-center space-x-2 space-x-reverse text-sm font-medium transition-all duration-300 group-hover:translate-x-1 ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}>
                    <span>مشاهده جزئیات</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>
                
                {/* Hover Effect Border */}
                <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none ${
                  isDarkMode 
                    ? 'border-blue-500 opacity-0 group-hover:opacity-30' 
                    : 'border-blue-500 opacity-0 group-hover:opacity-30'
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className={`group relative overflow-hidden rounded-full px-8 py-4 font-medium transition-all duration-300 hover:scale-105 ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}>
            <span className="relative z-10">مشاهده همه مناقصه‌ها</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
