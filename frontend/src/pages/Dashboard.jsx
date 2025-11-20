import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
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
  const { isDarkMode } = useTheme();
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
    const loadData = async () => {
      try {
        const { default: api } = await import("../api/index");
        const res = await api.get("/profile/auctions/");
        const created = res.data?.created_auctions || [];
        const participated = res.data?.participated_auctions || [];
        const won = res.data?.won_auctions || [];

        const wonIds = new Set(won.map((a) => a.id));
        const normalize = (a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          status: wonIds.has(a.id) ? "won" : a.status === "active" ? "active" : "lost",
          amount: Number(a.current_price || a.starting_price || 0),
          date: a.created_at || a.end_date,
          category: a.category,
          location: a.location,
          condition: a.condition,
          winner: a.winner?.username,
          fullDescription: a.description,
        });

        const auctionsData = [
          ...created.map(normalize),
          ...participated.map(normalize),
          ...won.map(normalize),
        ];

        setAllAuctions(auctionsData);
        setFilteredAuctions(auctionsData.slice(0, 3));

        const totalWon = won.length;
        const totalSpent = won.reduce((sum, a) => sum + Number(a.current_price || a.starting_price || 0), 0);
        const activeAuctions = auctionsData.filter((a) => a.status === "active").length;
        const monthlySpending = totalSpent; // simplify for now

        setFinancialData({
          totalBids: participated.length,
          totalWon,
          totalSpent,
          activeAuctions,
          monthlySpending,
          profitLoss: 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#0E2148] to-[#483AA0]"
            : "bg-[#604bfb]"
        }`}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0E2148] to-[#483AA0]"
          : "bg-[#604bfb]"
      }`}
    >
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-200">داشبورد</h1>
            <p className="mt-2 text-gray-200">
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
                        <div className="relative group">
                          <Link
                            to="/create-auction"
                            aria-disabled={!user?.subscription_active}
                            className={`block w-full text-center px-4 py-2 border border-[#E3D095] text-sm font-medium rounded-md text-[#E3D095] bg-white transition-colors ${
                              user?.subscription_active
                                ? "hover:bg-[#E3D095]/5"
                                : "opacity-50 cursor-not-allowed pointer-events-none"
                            }`}
                          >
                            ایجاد مزایده
                          </Link>
                          {!user?.subscription_active && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap hidden group-hover:block">
                              برای ایجاد مناقصه/مزایده اشتراک تهیه بفرمایید
                            </div>
                          )}
                        </div>
                        <div className="relative group">
                          <Link
                            to="/create-tender"
                            aria-disabled={!user?.subscription_active}
                            className={`block w-full text-center px-4 py-2 border border-[#E3D095] text-sm font-medium rounded-md text-[#E3D095] bg-white transition-colors ${
                              user?.subscription_active
                                ? "hover:bg-[#E3D095]/5"
                                : "opacity-50 cursor-not-allowed pointer-events-none"
                            }`}
                          >
                            ایجاد مناقصه
                          </Link>
                          {!user?.subscription_active && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap hidden group-hover:block">
                              برای ایجاد مناقصه/مزایده اشتراک تهیه بفرمایید
                            </div>
                          )}
                        </div>
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
