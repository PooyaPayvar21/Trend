import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`transition-all duration-500 backdrop-blur-sm $${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50 text-gray-800"
      }`}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : "bg-gradient-to-br from-blue-600 to-purple-700 text-white"
                }`}
              >
                🏛️
              </div>
              <div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  مزایده گر
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-200"
                  }`}
                >
                  بزرگترین پلتفرم مزایده آنلاین
                </p>
              </div>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-200"
              }`}
            >
              با مزایده گر، تجربهای نوین در دنیای مزایدات و مناقصات داشته باشید.
              امن، سریع و حرفهای.
            </p>
            <div className="flex space-x-3 space-x-reverse">
              {["فیس‌بوک", "توییتر", "اینستاگرام", "لینکدین"].map(
                (social, index) => (
                  <button
                    key={social}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white"
                        : "bg-gray-100 hover:bg-blue-600 text-gray-200 hover:text-white"
                    }`}
                  >
                    <span className="text-sm">📱</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              دسترسی سریع
            </h4>
            <div className="space-y-3">
              {[
                { text: "صفحه اصلی", icon: "🏠" },
                { text: "مزایده‌ها", icon: "🔨" },
                { text: "مناقصه‌ها", icon: "📋" },
                { text: "قیمت‌ها", icon: "💰" },
                { text: "وبلاگ", icon: "📝" },
              ].map((link, index) => (
                <a
                  key={link.text}
                  href="#"
                  className={`flex items-center space-x-2 space-x-reverse group transition-colors duration-200 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-200 hover:text-blue-600"
                  }`}
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  <span className="text-sm">{link.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              خدمات ما
            </h4>
            <div className="space-y-3">
              {[
                "مزایده آنلاین",
                "مناقصه الکترونیک",
                "ارزیابی تخصصی",
                "مشاوره رایگان",
                "پشتیبانی 24/7",
              ].map((service, index) => (
                <div
                  key={service}
                  className={`flex items-center space-x-2 space-x-reverse ${
                    isDarkMode ? "text-gray-300" : "text-gray-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              اطلاعات تماس
            </h4>
            <div className="space-y-4">
              <div
                className={`flex items-start space-x-3 space-x-reverse ${
                  isDarkMode ? "text-gray-300" : "text-gray-200"
                }`}
              >
                <FaPhone className="mt-1 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">تلفن تماس:</p>
                  <p className="text-sm">021-12345678</p>
                </div>
              </div>
              <div
                className={`flex items-start space-x-3 space-x-reverse ${
                  isDarkMode ? "text-gray-300" : "text-gray-200"
                }`}
              >
                <FaEnvelope className="mt-1 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">ایمیل:</p>
                  <p className="text-sm">info@mazayadeh.com</p>
                </div>
              </div>
              <div
                className={`flex items-start space-x-3 space-x-reverse ${
                  isDarkMode ? "text-gray-300" : "text-gray-200"
                }`}
              >
                <FaMapMarkerAlt className="mt-1 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">آدرس:</p>
                  <p className="text-sm">تهران، خیابان ولیعصر</p>
                </div>
              </div>
              <div
                className={`flex items-start space-x-3 space-x-reverse ${
                  isDarkMode ? "text-gray-300" : "text-gray-200"
                }`}
              >
                <FaClock className="mt-1 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">ساعات کار:</p>
                  <p className="text-sm">شنبه تا چهارشنبه 8-17</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div
          className={`mt-12 pt-8 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h4
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                عضویت در خبرنامه
              </h4>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-200"
                }`}
              >
                از آخرین مزایدات و مناقصات با خبر شوید
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید..."
                className={`flex-1 px-4 py-3 rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                }`}
              />
              <button
                className={`px-6 py-3 rounded-l-lg font-medium transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                عضویت
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`py-6 border-t ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-gray-50 border-gray-600"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-200"
              }`}
            >
              © {new Date().getFullYear()} مزایده گر. تمامی حقوق محفوظ است.
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <a
                href="#"
                className={`text-sm transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-200 hover:text-gray-800"
                }`}
              >
                حریم خصوصی
              </a>
              <span className={`text-gray-400`}>•</span>
              <a
                href="#"
                className={`text-sm transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                شرایط استفاده
              </a>
              <span className={`text-gray-400`}>•</span>
              <a
                href="#"
                className={`text-sm transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                نقشه سایت
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
