import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Reset password for:", email);
      setIsSubmitted(true);
      toast.success("لینک بازیابی رمز عبور با موفقیت ارسال شد");
    } catch {
      toast.error("خطا در ارسال لینک بازیابی. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
      }`}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-[#E3D095]/20">
              <FaEnvelope className="text-[#E3D095] text-2xl" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            بازیابی رمز عبور
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {!isSubmitted ? (
              <>
                ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور را برای شما
                ارسال کنیم
              </>
            ) : (
              <>
                لینک بازیابی رمز عبور به ایمیل شما ارسال شد. لطفاً صندوق ورودی
                ایمیل خود را بررسی کنید
              </>
            )}
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                ایمیل
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3D095] focus:border-transparent transition-colors duration-200"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[#E3D095] hover:bg-[#E3D095]/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E3D095] transition-colors duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black ml-2"></div>
                    در حال ارسال...
                  </div>
                ) : (
                  "ارسال لینک بازیابی"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100">
                  <FaCheckCircle className="text-green-600 text-2xl" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                اگر ایمیل را دریافت نکردید، لطفاً پوشه اسپم خود را بررسی کنید
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[#E3D095] hover:bg-[#E3D095]/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E3D095] transition-colors duration-200"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center font-medium text-[#E3D095] hover:text-[#E3D095]/70 transition-colors"
          >
            <FaArrowLeft className="ml-2" size={14} />
            بازگشت به صفحه ورود
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
