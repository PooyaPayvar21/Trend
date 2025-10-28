import React from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTrophy,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";

const AuctionDetailModal = ({ auction, isOpen, onClose }) => {
  if (!isOpen || !auction) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "won":
        return {
          text: "برنده شده",
          color: "text-green-600 bg-green-100",
          icon: "🏆",
        };
      case "active":
        return {
          text: "فعال",
          color: "text-blue-600 bg-blue-100",
          icon: "⚡",
        };
      case "lost":
        return {
          text: "باخته",
          color: "text-red-600 bg-red-100",
          icon: "❌",
        };
      default:
        return {
          text: "نامشخص",
          color: "text-gray-600 bg-gray-100",
          icon: "❓",
        };
    }
  };

  const statusInfo = getStatusInfo(auction.status);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">جزئیات مزایده</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Auction Title and Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {auction.title}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
              >
                <span className="ml-2">{statusInfo.icon}</span>
                {statusInfo.text}
              </span>
            </div>
            <p className="text-gray-600">
              {auction.description || "توضیحات مزایده در اینجا قرار می‌گیرد..."}
            </p>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Price Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MdAttachMoney className="ml-2 text-green-600" />
                اطلاعات مالی
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">مبلغ پیشنهادی:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(auction.amount)}
                  </span>
                </div>
                {auction.currentBid && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">پیشنهاد فعلی:</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(auction.currentBid)}
                    </span>
                  </div>
                )}
                {auction.finalPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">قیمت نهایی:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(auction.finalPrice)}
                    </span>
                  </div>
                )}
                {auction.profit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">سود حاصل:</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(auction.profit)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Date and Time Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FaCalendarAlt className="ml-2 text-blue-600" />
                اطلاعات زمانی
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">تاریخ مزایده:</span>
                  <span className="font-semibold text-gray-900">
                    {auction.date}
                  </span>
                </div>
                {auction.startTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">زمان شروع:</span>
                    <span className="font-semibold text-gray-900">
                      {auction.startTime}
                    </span>
                  </div>
                )}
                {auction.endTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">زمان پایان:</span>
                    <span className="font-semibold text-gray-900">
                      {auction.endTime}
                    </span>
                  </div>
                )}
                {auction.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">مدت زمان:</span>
                    <span className="font-semibold text-gray-900">
                      {auction.duration}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location and Category */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FaMapMarkerAlt className="ml-2 text-purple-600" />
                اطلاعات مکانی
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">دسته‌بندی:</span>
                  <span className="font-semibold text-gray-900">
                    {getCategoryName(auction.category)}
                  </span>
                </div>
                {auction.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">مکان:</span>
                    <span className="font-semibold text-gray-900">
                      {auction.location}
                    </span>
                  </div>
                )}
                {auction.condition && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">وضعیت:</span>
                    <span className="font-semibold text-gray-900">
                      {auction.condition}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Participants and Bids */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FaUser className="ml-2 text-indigo-600" />
                شرکت‌کنندگان
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد شرکت‌کنندگان:</span>
                  <span className="font-semibold text-gray-900">
                    {auction.participants || "نامشخص"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد پیشنهادات:</span>
                  <span className="font-semibold text-gray-900">
                    {auction.bidCount || "نامشخص"}
                  </span>
                </div>
                {auction.winner && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">برنده:</span>
                    <span className="font-semibold text-green-600">
                      {auction.winner}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {auction.fullDescription && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                توضیحات کامل
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {auction.fullDescription}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              بستن
            </button>
            {auction.status === "active" && (
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                شرکت در مزایده
              </button>
            )}
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              مشاهده جزئیات کامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryName = (category) => {
  const categories = {
    vehicle: "خودرو",
    property: "ملک",
    precious_metal: "فلزات گرانبها",
    electronics: "الکترونیک",
    industrial: "صنعتی",
    luxury: "لوکس",
    art: "هنر",
    antique: "عتیقه",
  };
  return categories[category] || category;
};

export default AuctionDetailModal;
