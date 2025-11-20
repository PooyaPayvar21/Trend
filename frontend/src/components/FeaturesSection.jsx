import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaGavel,
  FaCar,
  FaGem,
  FaIndustry,
  FaHome,
  FaFileContract,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";

const features = [
  {
    title: "بررسی‌های مجازی",
    description: "بررسی و مشاهده کالاها به صورت آنلاین با کیفیت بالا",
    icon: FaGavel,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    category: "خدمات IT",
    location: "تهران",
    deadline: "1404/09/05",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های خودرو",
    description: "شرکت در مزایده‌های خودروهای مختلف با ضمانت",
    icon: FaCar,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    category: "خودرو",
    location: "تهران",
    deadline: "1404/08/25",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های وسایل و ساعت",
    description: "دسترسی به مزایده‌های وسایل لوکس و ساعتهای گرانقیمت",
    icon: FaGem,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    category: "لوکس",
    location: "اصفهان",
    deadline: "1404/09/10",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های رویدادهای صنعتی",
    description: "شرکت در مزایده‌های تجهیزات و رویدادهای صنعتی",
    icon: FaIndustry,
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    category: "صنعت",
    location: "تبریز",
    deadline: "1404/09/15",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های ملک",
    description: "خرید و فروش املاک از طریق مزایده با مشاوره تخصصی",
    icon: FaHome,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    category: "املاک",
    location: "شیراز",
    deadline: "1404/09/20",
    featured: true,
    type: "auction",
  },
  {
    title: "ثبت قرارداد برای ایران",
    description: "امکان ثبت و مشاهده قراردادها با امنیت بالا",
    icon: FaFileContract,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    category: "قرارداد",
    location: "مشهد",
    deadline: "1404/09/30",
    featured: true,
    type: "tender",
  },
];

const FeaturesSection = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleCardClick = (feature) => {
    if (feature?.type === "tender") {
      navigate("/create-tender", { state: { feature } });
    } else {
      navigate("/create-auction", { state: { feature } });
    }
  };

  const handleKeyDown = (e, feature) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(feature);
    }
  };

  return (
    <section
      className={`py-16 transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-400 via-white to-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full mb-6 ${
              isDarkMode
                ? "bg-blue-900/50 text-blue-300"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <span className="text-sm font-medium">خدمات برتر</span>
            <span>⭐</span>
          </div>
          <h2
            className={`text-4xl lg:text-5xl font-bold mb-6 transition-all duration-300 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            آگهی های ویژه
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            دسترسی به جدیدترین آگهی های فعال در سراسر کشور با بالاترین
            استانداردهای امنیتی و کیفیتی
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={index}
                to={"/create-auction"}
                state={{ feature }}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(feature)}
                onKeyDown={(e) => handleKeyDown(e, feature)}
                dir="rtl"
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 group block no-underline focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700 hover:shadow-lg"
                    : "bg-gray-400 border border-none hover:shadow-lg hover:scale-105"
                }`}
                aria-label={`مشاهده آگهی: ${feature.title}`}
              >
                {/* top-right badge (featured) */}
                {feature.featured && (
                  <div className="absolute -top-3 left-4 mt-4">
                    <div className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-tr-lg rounded-bl-lg">
                      ویژه
                    </div>
                  </div>
                )}

                {/* small logo / tag at top-left */}
                <div className="absolute -top-5 right-6 mt-6 ">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    }`}
                    aria-hidden
                  >
                    <IconComponent className={`w-6 h-6 ${feature.textColor}`} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative p-6 pt-8 text-right h-full flex flex-col justify-between mt-7">
                  <h3
                    className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>

                  {/* meta row */}
                  <div className="flex items-center justify-between gap-4 h-12">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 bg-gray-100/60 dark:bg-gray-700/40 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-200">
                        <FaBriefcase className="w-3 h-3" />
                        <span>{feature.category}</span>
                      </span>

                      <span className="inline-flex items-center gap-2 bg-gray-100/60 dark:bg-gray-700/40 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-200">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span>{feature.location}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-white border border-gray-200 text-gray-700"
                        }`}
                      >
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{feature.deadline}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* subtle border highlight when hovered */}
                <div
                  className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
                    isDarkMode ? "opacity-0 group-hover:opacity-0" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
