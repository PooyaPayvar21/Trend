import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCrown, FaMedal, FaStar, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import authAPI from "../api/auth";

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const subscriptionPlans = [
    {
      id: "bronze",
      name: "برنزی",
      price: "99,000",
      originalPrice: "150,000",
      duration: "1 ماه",
      icon: FaMedal,
      color: "bronze",
      features: [
        "دسترسی به مزایده‌های پایه",
        "حداکثر 5 پیشنهاد در روز",
        "اطلاع‌رسانی ایمیلی",
        "پشتیبانی ایمیلی",
      ],
      notIncluded: [
        "دسترسی به مزایده‌های ویژه",
        "پیشنهاد نامحدود",
        "پشتیبانی تلفنی",
        "گزارش‌های پیشرفته",
      ],
    },
    {
      id: "silver",
      name: "نقره‌ای",
      price: "199,000",
      originalPrice: "300,000",
      duration: "1 ماه",
      icon: FaStar,
      color: "silver",
      features: [
        "تمام امکانات برنزی",
        "دسترسی به مزایده‌های ویژه",
        "حداکثر 20 پیشنهاد در روز",
        "اطلاع‌رسانی پیامکی",
        "پشتیبانی تلفنی",
        "گزارش‌های پایه",
      ],
      notIncluded: ["پیشنهاد نامحدود", "گزارش‌های پیشرفته", "مشاوره تخصصی"],
    },
    {
      id: "gold",
      name: "طلایی",
      price: "399,000",
      originalPrice: "600,000",
      duration: "1 ماه",
      icon: FaCrown,
      color: "gold",
      features: [
        "تمام امکانات نقره‌ای",
        "پیشنهاد نامحدود",
        "دسترسی به تمام مزایده‌ها",
        "اطلاع‌رسانی فوری",
        "پشتیبانی 24/7",
        "گزارش‌های پیشرفته",
        "مشاوره تخصصی",
        "اولویت در پشتیبانی",
      ],
      notIncluded: [],
    },
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      const response = await authAPI.purchaseSubscription(planId);
      updateUser(response.user);
      toast.success(
        `اشتراک ${
          subscriptionPlans.find((p) => p.id === planId)?.name
        } با موفقیت خریداری شد!`
      );
    } catch (error) {
      toast.error(error.detail || "خطا در خرید اشتراک. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (color) => {
    switch (color) {
      case "bronze":
        return "from-amber-600 to-amber-800";
      case "silver":
        return "from-gray-400 to-gray-600";
      case "gold":
        return "from-yellow-400 to-yellow-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getPlanBorderColor = (color) => {
    switch (color) {
      case "bronze":
        return "border-amber-500";
      case "silver":
        return "border-gray-400";
      case "gold":
        return "border-yellow-400";
      default:
        return "border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            انتخاب اشتراک
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اشتراک مناسب خود را انتخاب کنید و از امکانات ویژه پلتفرم ما بهره‌مند
            شوید
          </p>
        </div>

        {user?.subscription_active && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-green-800">
                  اشتراک فعلی شما
                </h3>
                <p className="text-green-600">
                  {user.subscription_type === "bronze" && "برنزی"}
                  {user.subscription_type === "silver" && "نقره‌ای"}
                  {user.subscription_type === "gold" && "طلایی"}
                  {user.subscription_end_date && (
                    <span>
                      {" "}
                      - تا{" "}
                      {new Date(user.subscription_end_date).toLocaleDateString(
                        "fa-IR"
                      )}
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">فعال</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => {
            const IconComponent = plan.icon;
            const isCurrentPlan =
              user?.subscription_type === plan.id && user?.subscription_active;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isCurrentPlan ? "ring-2 ring-green-500" : ""
                }`}
              >
                <div
                  className={`bg-gradient-to-r ${getPlanColor(
                    plan.color
                  )} p-6 text-white text-center`}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full bg-white/20 ${getPlanBorderColor(
                        plan.color
                      )} border-2`}
                    >
                      <IconComponent size={32} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-lg">تومان</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-sm line-through opacity-75">
                      {plan.originalPrice}
                    </span>
                    <span className="text-sm">تومان</span>
                  </div>
                  <p className="text-sm mt-2 opacity-90">{plan.duration}</p>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    امکانات شامل:
                  </h4>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck
                          className="text-green-500 mt-1 ml-2 flex-shrink-0"
                          size={14}
                        />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        شامل نمی‌شود:
                      </h4>
                      <ul className="space-y-3 mb-6">
                        {plan.notIncluded.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <FaTimes
                              className="text-red-500 mt-1 ml-2 flex-shrink-0"
                              size={14}
                            />
                            <span className="text-gray-500 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || isCurrentPlan}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isCurrentPlan
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : `bg-gradient-to-r ${getPlanColor(
                            plan.color
                          )} text-white hover:opacity-90`
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        در حال پردازش...
                      </div>
                    ) : isCurrentPlan ? (
                      "اشتراک فعلی شما"
                    ) : user?.subscription_active ? (
                      "تمدید اشتراک"
                    ) : (
                      "خرید اشتراک"
                    )}
                  </button>
                </div>

                {plan.id === "silver" && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      محبوب
                    </span>
                  </div>
                )}

                {plan.id === "gold" && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      بهترین ارزش
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            اطلاعات مهم:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• تمام اشتراک‌ها به مدت 30 روز معتبر هستند</li>
            <li>• امکان تمدید خودکار اشتراک وجود دارد</li>
            <li>• در صورت عدم رضایت، تا 7 روز امکان بازگشت وجه وجود دارد</li>
            <li>• پشتیبانی 24/7 برای تمام اشتراک‌ها</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
