import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaFilter,
  FaTimes as FaClose,
  FaEye,
  FaCrown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import authAPI from "../api/auth";
import AuctionDetailModal from "../components/AuctionDetailModal";

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [financialData, setFinancialData] = useState({
    totalBids: 0,
    totalWon: 0,
    totalSpent: 0,
    activeAuctions: 0,
    monthlySpending: 0,
    profitLoss: 0,
  });

  const [allAuctions, setAllAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showAuctionDetail, setShowAuctionDetail] = useState(false);
  const [profileData, setProfileData] = useState({
    phone_number: user?.phone_number || "",
    address: user?.address || "",
    company: user?.company || "",
    national_id: user?.national_id || "",
  });

  useEffect(() => {
    setProfileData({
      phone_number: user?.phone_number || "",
      address: user?.address || "",
      company: user?.company || "",
      national_id: user?.national_id || "",
    });
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setFinancialData({
        totalBids: 24,
        totalWon: 8,
        totalSpent: 125000000,
        activeAuctions: 3,
        monthlySpending: 45000000,
        profitLoss: 15000000,
      });

      const auctionsData = [
        {
          id: 1,
          title: "خودرو BMW X5 مدل 2022",
          description: "خودرو لوکس BMW X5 با موتور 3.0 لیتری و امکانات کامل",
          status: "won",
          amount: 85000000,
          date: "2024-03-20",
          profit: 5000000,
          category: "vehicle",
          currentBid: 85000000,
          startTime: "14:00",
          endTime: "16:30",
          duration: "2 ساعت و 30 دقیقه",
          location: "تهران، خیابان ولیعصر",
          condition: "عالی",
          participants: 12,
          bidCount: 8,
          winner: "احمد محمدی",
          fullDescription:
            "این خودرو با موتور 3.0 لیتری توربوشارژر، گیربکس 8 سرعته اتوماتیک و امکانات کامل شامل سیستم ناوبری، دوربین 360 درجه، صندلی‌های چرمی و سیستم صوتی حرفه‌ای عرضه می‌شود. خودرو در شرایط عالی و با کارکرد کم در مزایده شرکت داده شده است.",
        },
        {
          id: 2,
          title: "ملک مسکونی 200 متری در منطقه 1 تهران",
          description: "آپارتمان لوکس در منطقه 1 تهران با امکانات کامل",
          status: "active",
          amount: 120000000,
          date: "2024-03-18",
          currentBid: 125000000,
          category: "property",
          startTime: "10:00",
          endTime: "12:00",
          duration: "2 ساعت",
          location: "تهران، منطقه 1، خیابان فرمانیه",
          condition: "نوساز",
          participants: 8,
          bidCount: 5,
          fullDescription:
            "آپارتمان 200 متری در منطقه 1 تهران با 3 خواب، 2 سرویس بهداشتی، آشپزخانه مجهز، بالکن و پارکینگ. این ملک در طبقه 8 ساختمان 12 واحدی قرار دارد و دارای نمای آفتابگیر و دسترسی عالی به امکانات شهری است.",
        },
        {
          id: 3,
          title: "سکه طلای تمام بهار آزادی",
          description: "سکه طلای تمام بهار آزادی با وزن 8.13 گرم",
          status: "lost",
          amount: 15000000,
          date: "2024-03-15",
          finalPrice: 16500000,
          category: "precious_metal",
          startTime: "15:00",
          endTime: "15:30",
          duration: "30 دقیقه",
          location: "تهران، مرکز طلا و جواهر",
          condition: "نو",
          participants: 25,
          bidCount: 15,
          winner: "علی رضایی",
          fullDescription:
            "سکه طلای تمام بهار آزادی با وزن 8.13 گرم و عیار 900 که در سال 1357 ضرب شده است. این سکه در شرایط عالی و بدون هیچ گونه خراش یا آسیب نگهداری شده است.",
        },
        {
          id: 4,
          title: "لپ‌تاپ Dell XPS 15 اینچی",
          description: "لپ‌تاپ حرفه‌ای Dell XPS با پردازنده Intel i7",
          status: "won",
          amount: 25000000,
          date: "2024-03-10",
          profit: 2000000,
          category: "electronics",
          currentBid: 25000000,
          startTime: "11:00",
          endTime: "11:45",
          duration: "45 دقیقه",
          location: "تهران، خیابان انقلاب",
          condition: "مثل نو",
          participants: 6,
          bidCount: 4,
          winner: "سارا احمدی",
          fullDescription:
            "لپ‌تاپ Dell XPS 15 اینچی با پردازنده Intel Core i7-12700H، رم 16GB، هارد 512GB SSD، کارت گرافیک RTX 3050 و نمایشگر 4K. این لپ‌تاپ برای کارهای حرفه‌ای و بازی مناسب است.",
        },
        {
          id: 5,
          title: "ماشین آلات صنعتی CNC",
          description: "دستگاه CNC 5 محوره برای کارگاه‌های صنعتی",
          status: "active",
          amount: 80000000,
          date: "2024-03-12",
          currentBid: 85000000,
          category: "industrial",
          startTime: "09:00",
          endTime: "11:00",
          duration: "2 ساعت",
          location: "اصفهان، شهرک صنعتی",
          condition: "کارکرده",
          participants: 4,
          bidCount: 3,
          fullDescription:
            "دستگاه CNC 5 محوره با قابلیت تراشکاری و فرزکاری فلزات. این دستگاه مناسب برای کارگاه‌های صنعتی و تولید قطعات دقیق است. شامل نرم‌افزار کنترل و ابزارهای جانبی می‌باشد.",
        },
        {
          id: 6,
          title: "ساعت Rolex Submariner",
          description: "ساعت لوکس Rolex Submariner مدل 2020",
          status: "lost",
          amount: 45000000,
          date: "2024-03-08",
          finalPrice: 52000000,
          category: "luxury",
          startTime: "16:00",
          endTime: "16:20",
          duration: "20 دقیقه",
          location: "تهران، مرکز خرید تیراژه",
          condition: "مثل نو",
          participants: 18,
          bidCount: 12,
          winner: "محمد کریمی",
          fullDescription:
            "ساعت لوکس Rolex Submariner با قابلیت ضد آب تا عمق 300 متر. این ساعت دارای کریستال یاقوت، بند فلزی و موتور خودکار است. مناسب برای استفاده روزانه و ورزش‌های آبی.",
        },
      ];

      setAllAuctions(auctionsData);
      setFilteredAuctions(auctionsData.slice(0, 3));
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "won":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "lost":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      updateUser(updatedUser);
      toast.success("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error.detail || "خطا در به‌روزرسانی اطلاعات");
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      phone_number: user?.phone_number || "",
      address: user?.address || "",
      company: user?.company || "",
      national_id: user?.national_id || "",
    });
    setIsEditingProfile(false);
  };

  const handleCardClick = (filterType) => {
    if (activeFilter === filterType) {
      // If clicking the same card, clear filter
      setActiveFilter(null);
      setFilteredAuctions(allAuctions.slice(0, 3));
      toast.success("فیلتر حذف شد");
    } else {
      // Apply new filter
      setActiveFilter(filterType);
      let filtered = [];

      switch (filterType) {
        case "totalSpent":
          filtered = allAuctions.filter(
            (auction) => auction.status === "won" || auction.status === "lost"
          );
          break;
        case "profitLoss":
          filtered = allAuctions.filter(
            (auction) => auction.status === "won" && auction.profit
          );
          break;
        case "totalWon":
          filtered = allAuctions.filter((auction) => auction.status === "won");
          break;
        case "activeAuctions":
          filtered = allAuctions.filter(
            (auction) => auction.status === "active"
          );
          break;
        default:
          filtered = allAuctions;
      }

      setFilteredAuctions(filtered);
      toast.success(`نمایش مزایده‌های ${getFilterTitle(filterType)}`);
    }
  };

  const getFilterTitle = (filterType) => {
    switch (filterType) {
      case "totalSpent":
        return "هزینه شده";
      case "profitLoss":
        return "سودآور";
      case "totalWon":
        return "برنده شده";
      case "activeAuctions":
        return "فعال";
      default:
        return "همه";
    }
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setFilteredAuctions(allAuctions.slice(0, 3));
    toast.success("فیلتر حذف شد");
  };

  const handleAuctionClick = (auction) => {
    setSelectedAuction(auction);
    setShowAuctionDetail(true);
  };

  const closeAuctionDetail = () => {
    setShowAuctionDetail(false);
    setSelectedAuction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">داشبورد</h1>
            <p className="mt-2 text-gray-600">
              خوش آمدید {user?.username || "کاربر"}! خلاصه‌ای از فعالیت‌های شما
            </p>
          </div>

          {/* Active Filter Display */}
          {activeFilter && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaFilter className="text-blue-600 ml-2" />
                <span className="text-blue-800 font-medium">
                  فیلتر فعال: {getFilterTitle(activeFilter)}
                </span>
              </div>
              <button
                onClick={clearFilter}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaClose size={16} />
              </button>
            </div>
          )}

          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Subscription Status Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        user?.subscription_active
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : "bg-gray-100"
                      }`}
                    >
                      <FaCrown
                        className={`${
                          user?.subscription_active
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                        size={16}
                      />
                    </div>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-500">
                      وضعیت اشتراک
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        user?.subscription_active
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {user?.subscription_active
                        ? (() => {
                            switch (user.subscription_type) {
                              case "bronze":
                                return "برنزی";
                              case "silver":
                                return "نقره‌ای";
                              case "gold":
                                return "طلایی";
                              default:
                                return "فعال";
                            }
                          })()
                        : "بدون اشتراک"}
                    </p>
                  </div>
                </div>
                {user?.subscription_active && user?.subscription_end_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    تا{" "}
                    {new Date(user.subscription_end_date).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeFilter === "totalSpent"
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => handleCardClick("totalSpent")}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600">💰</span>
                    </div>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-500">
                      کل هزینه‌ها
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(financialData.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeFilter === "profitLoss"
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => handleCardClick("profitLoss")}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600">📈</span>
                    </div>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-500">
                      سود/زیان
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        financialData.profitLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {financialData.profitLoss >= 0 ? "+" : ""}
                      {formatCurrency(financialData.profitLoss)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeFilter === "totalWon"
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => handleCardClick("totalWon")}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-600">🎯</span>
                    </div>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-500">
                      مزایده‌های برنده
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {financialData.totalWon} از {financialData.totalBids}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeFilter === "activeAuctions"
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => handleCardClick("activeAuctions")}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600">⚡</span>
                    </div>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-500">
                      مزایده‌های فعال
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {financialData.activeAuctions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile & Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      پروفایل کاربری
                    </h3>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaEdit size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 text-xl font-bold">
                          {user?.username?.charAt(0) || "ع"}
                        </span>
                      </div>
                    </div>
                    <div className="mr-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {user?.username || "کاربر"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        شماره تلفن
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          name="phone_number"
                          value={profileData.phone_number}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="09123456789"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaPhone className="ml-2" />
                          {profileData.phone_number || "ثبت نشده"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        آدرس
                      </label>
                      {isEditingProfile ? (
                        <textarea
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="آدرس کامل خود را وارد کنید"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 flex items-start">
                          <FaMapMarkerAlt className="ml-2 mt-1 flex-shrink-0" />
                          {profileData.address || "ثبت نشده"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نام شرکت
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          name="company"
                          value={profileData.company}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="نام شرکت (اختیاری)"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {profileData.company || "ثبت نشده"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        کد ملی
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          name="national_id"
                          value={profileData.national_id}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="کد ملی 10 رقمی"
                          maxLength={10}
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {profileData.national_id || "ثبت نشده"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditingProfile && (
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaSave size={14} />
                        ذخیره
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimes size={14} />
                        انصراف
                      </button>
                    </div>
                  )}

                  <div className="mt-6 space-y-2">
                    <Link
                      to="/profile"
                      className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      ویرایش پروفایل کامل
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    اقدامات سریع
                  </h3>
                  <div className="space-y-3">
                    <Link
                      to="/auctions"
                      className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      مشاهده مزایده‌ها
                    </Link>
                    <Link
                      to="/trend"
                      className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      مشاهده مناقصه‌ها
                    </Link>
                    <Link
                      to="/inquiry"
                      className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      استعلام قیمت
                    </Link>

                    {/* Create Buttons */}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        ایجاد جدید
                      </h4>
                      <div className="space-y-2">
                        <Link
                          to="/create-auction"
                          className="block w-full text-center px-4 py-2 border border-[#E3D095] text-sm font-medium rounded-md text-[#E3D095] bg-white hover:bg-[#E3D095]/5 transition-colors"
                        >
                          ایجاد مزایده
                        </Link>
                        <Link
                          to="/create-tender"
                          className="block w-full text-center px-4 py-2 border border-[#E3D095] text-sm font-medium rounded-md text-[#E3D095] bg-white hover:bg-[#E3D095]/5 transition-colors"
                        >
                          ایجاد مناقصه
                        </Link>
                      </div>
                    </div>

                    <Link
                      to="/subscription"
                      className={`block w-full text-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        user?.subscription_active
                          ? "border border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                          : "border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaCrown size={14} />
                        {user?.subscription_active
                          ? "تمدید اشتراک"
                          : "خرید اشتراک"}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="lg:col-span-2">
              {/* Recent Auctions */}
              <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {activeFilter
                        ? `مزایده‌های ${getFilterTitle(activeFilter)}`
                        : "مزایده‌های اخیر"}
                    </h3>
                    {activeFilter && (
                      <span className="text-sm text-gray-500">
                        {filteredAuctions.length} مورد
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {filteredAuctions.length > 0 ? (
                      filteredAuctions.map((auction) => (
                        <div
                          key={auction.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleAuctionClick(auction)}
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {auction.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {auction.date}
                            </p>
                            {auction.profit && (
                              <p className="text-xs text-green-600 mt-1">
                                سود: {formatCurrency(auction.profit)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(auction.amount)}
                              </p>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  auction.status
                                )}`}
                              >
                                {auction.status === "won"
                                  ? "برنده"
                                  : auction.status === "active"
                                  ? "فعال"
                                  : "باخته"}
                              </span>
                            </div>
                            <FaEye
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              size={16}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>هیچ مزایده‌ای یافت نشد</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Monthly Spending Chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    هزینه ماهانه
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">نمودار هزینه ماهانه</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Detail Modal */}
      <AuctionDetailModal
        auction={selectedAuction}
        isOpen={showAuctionDetail}
        onClose={closeAuctionDetail}
      />
    </div>
  );
};

export default Dashboard;
