import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaUser,
  FaComments,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const ConsultationSection = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("درخواست مشاوره شما با موفقیت ارسال شد");
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("خطا در ارسال درخواست. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const consultationFeatures = [
    {
      icon: "📊",
      title: "تحلیل تخصصی",
      description: "تحلیل دقیق بازار و قیمت‌ها توسط کارشناسان مجرب",
    },
    {
      icon: "🎯",
      title: "راهنمایی هدفمند",
      description: "راهنمایی بر اساس نیازها و شرایط خاص شما",
    },
    {
      icon: "⚡",
      title: "پاسخ سریع",
      description: "پاسخ‌دهی سریع و به موقع به درخواست‌های شما",
    },
    {
      icon: "🔒",
      title: "مشاوره رایگان",
      description: "مشاوره کاملاً رایگان و بدون هیچ هزینه‌ای",
    },
  ];

  if (isSubmitted) {
    return (
      <div
        className={`py-16 transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#0E2148] to-[#483AA0]"
            : "bg-gradient-to-br from-[#604bfb] to-[#7c5cfb]"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              درخواست شما با موفقیت ارسال شد
            </h2>
            <p className="text-gray-600 mb-6">
              کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#E3D095] hover:bg-[#E3D095]/90 text-[#0E2148] font-bold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              درخواست جدید
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`py-16 transition-all duration-300 rounded-2xl ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0E2148] to-[#483AA0]"
          : "bg-gradient-to-br from-[#604bfb] to-[#7c5cfb]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            دریافت مشاوره رایگان
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            کارشناسان مجرب ما آماده ارائه مشاوره تخصصی در زمینه مزایده‌ها و
            مناقصه‌ها هستند
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              چرا مشاوره ما؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {consultationFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-white/70 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FaPhone className="text-[#E3D095]" />
                تماس مستقیم
              </h4>
              <div className="space-y-2 text-white/80">
                <p>شماره تماس: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                <p>ایمیل: info@trend.com</p>
                <p>ساعات کاری: شنبه تا چهارشنبه ۸ صبح تا ۶ عصر</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaComments className="text-[#E3D095]" />
              درخواست مشاوره
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام و نام خانوادگی *
                </label>
                <div className="relative">
                  <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                    placeholder="نام و نام خانوادگی خود را وارد کنید"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تماس *
                </label>
                <div className="relative">
                  <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                    placeholder="شماره تماس خود را وارد کنید"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                    placeholder="ایمیل خود را وارد کنید (اختیاری)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  موضوع
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="موضوع درخواست خود را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  پیام *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="توضیحات درخواست خود را وارد کنید"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#E3D095] hover:bg-[#E3D095]/90 text-[#0E2148] hover:shadow-lg"
                }`}
              >
                {isLoading ? "در حال ارسال..." : "ارسال درخواست مشاوره"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationSection;
