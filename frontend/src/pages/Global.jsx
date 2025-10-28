import React from "react";
import { useTheme } from "../context/ThemeContext";

const Global = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen py-6 sm:py-12 flex items-center justify-center transition-all duration-300 ${
      isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
    }`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-8 border border-[#E3D095]/20 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            راهنمای بارگذاری مدارک
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <div className="space-y-4 text-gray-700">
                <p className="text-sm sm:text-base">
                  برای ثبت‌نام در سیستم، لطفاً مدارک زیر را آماده کنید:
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                  <li>تصویر کارت ملی (اجباری)</li>
                  <li>تصویر صفحه اول شناسنامه (اجباری)</li>
                  <li>عکس پرسنلی با زمینه سفید (اجباری)</li>
                  <li>آخرین مدرک تحصیلی (اختیاری)</li>
                </ul>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    نکات مهم
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                    <li>تمامی تصاویر باید واضح و خوانا باشند</li>
                    <li>حجم هر فایل نباید از 2 مگابایت بیشتر باشد</li>
                    <li>فرمت‌های قابل قبول: JPG، PNG، PDF</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 sm:p-6">
              <div className="text-center">
                <button
                  className="w-full bg-gradient-to-r from-[#E3D095] to-[#B4A06A] hover:from-[#B4A06A] hover:to-[#E3D095] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => (window.location.href = "/login")}
                >
                  ورود / ثبت‌نام
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Global;
