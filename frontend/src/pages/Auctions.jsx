import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PersianDateTime from "../components/PersianDateTime";
import { useTheme } from "../context/ThemeContext";
import ConsultationSection from "../components/ConsultationSection";

const auctions = [
  {
    id: 1,
    title: "مزایده فروش زمین",
    description: "زمین کشاورزی ۵۰۰۰ متری در شمال کشور",
    price: "۲,۵۰۰,۰۰۰,۰۰۰",
    deadline: "2024-03-20T10:00:00",
    status: "فعال",
    location: "شمال کشور",
    area: "۵۰۰۰ متر",
    type: "زمین کشاورزی",
    details:
      "این زمین در منطقه حاصلخیز شمال کشور واقع شده و دارای دسترسی مناسب به جاده اصلی است. دارای مجوزهای لازم برای کشاورزی و امکان احداث سازه های مورد نیاز می باشد.",
    contact: "۰۹۱۲۳۴۵۶۷۸۹",
    documents: ["سند مالکیت", "مشخصات فنی", "نقشه موقعیت"],
  },
  {
    id: 2,
    title: "مزایده فروش خودرو",
    description: "خودروی سواری مدل ۱۳۹۸ کم کارکرد",
    price: "۸۵۰,۰۰۰,۰۰۰",
    deadline: "2024-03-15T14:30:00",
    status: "فعال",
    brand: "تویوتا",
    model: "کمری",
    year: "۱۳۹۸",
    mileage: "۳۵,۰۰۰",
    details:
      "خودروی کم کارکرد با رنگ اصلی و بدون تصادف. تمام سرویس‌های دوره‌ای انجام شده و دارای بیمه شخص ثالث می‌باشد.",
    contact: "۰۹۱۲۳۴۵۶۷۸۹",
    documents: ["کارت ماشین", "بیمه نامه", "گواهی سلامت فنی"],
  },
  {
    id: 3,
    title: "مزایده فروش خودرو",
    description: "خودروی سواری مدل ۱۳۹۸ کم کارکرد",
    price: "۸۵۰,۰۰۰,۰۰۰",
    deadline: "2024-03-18T09:00:00",
    status: "فعال",
    brand: "تویوتا",
    model: "کمری",
    year: "۱۳۹۸",
    mileage: "۳۵,۰۰۰",
    details:
      "خودروی کم کارکرد با رنگ اصلی و بدون تصادف. تمام سرویس‌های دوره‌ای انجام شده و دارای بیمه شخص ثالث می‌باشد.",
    contact: "۰۹۱۲۳۴۵۶۷۸۹",
    documents: ["کارت ماشین", "بیمه نامه", "گواهی سلامت فنی"],
  },
  {
    id: 4,
    title: "مزایده فروش خودرو",
    description: "خودروی سواری مدل ۱۳۹۸ کم کارکرد",
    price: "۸۵۰,۰۰۰,۰۰۰",
    deadline: "2024-03-10T16:00:00",
    status: "غیرفعال",
    brand: "تویوتا",
    model: "کمری",
    year: "۱۳۹۸",
    mileage: "۳۵,۰۰۰",
    details:
      "خودروی کم کارکرد با رنگ اصلی و بدون تصادف. تمام سرویس‌های دوره‌ای انجام شده و دارای بیمه شخص ثالث می‌باشد.",
    contact: "۰۹۱۲۳۴۵۶۷۸۹",
    documents: ["کارت ماشین", "بیمه نامه", "گواهی سلامت فنی"],
  },
  {
    id: 5,
    title: "مزایده فروش خودرو",
    description: "خودروی سواری مدل ۱۳۹۸ کم کارکرد",
    price: "۸۵۰,۰۰۰,۰۰۰",
    deadline: "2024-03-08T11:30:00",
    status: "غیرفعال",
    brand: "تویوتا",
    model: "کمری",
    year: "۱۳۹۸",
    mileage: "۳۵,۰۰۰",
    details:
      "خودروی کم کارکرد با رنگ اصلی و بدون تصادف. تمام سرویس‌های دوره‌ای انجام شده و دارای بیمه شخص ثالث می‌باشد.",
    contact: "۰۹۱۲۳۴۵۶۷۸۹",
    documents: ["کارت ماشین", "بیمه نامه", "گواهی سلامت فنی"],
  },
  {
    id: 6,
    title: "مزایده فروش تجهیزات",
    description: "تجهیزات صنعتی نو و دست دوم",
    price: "۱,۲۰۰,۰۰۰,۰۰۰",
    deadline: "2024-03-05T13:45:00",
    status: "غیرفعال",
    category: "تجهیزات صنعتی",
    condition: "نو و دست دوم",
    details:
      "مجموعه‌ای از تجهیزات صنعتی نو و دست دوم شامل دستگاه‌های CNC، ابزارآلات و ماشین‌آلات صنعتی. تمامی تجهیزات دارای گارانتی و خدمات پس از فروش می‌باشند.",
    contact: "۰۹۱۲۳۴۵۶۷۸۹",
    documents: ["فاکتور خرید", "گارانتی", "مشخصات فنی"],
  },
];

const slides = [
  {
    bg: "from-[#0E2148] to-[#483AA0]",
    title: "مزایده های سراسر کشور",
    desc: "در یک پلتفرم، بهترین مزایده‌ها و مناقصه‌ها را از سراسر کشور پیدا کنید.",
    btn: "مشاهده مزایده‌ها",
  },
  {
    bg: "from-[#483AA0] to-[#7965C1]",
    title: "فرصت‌های ویژه برای خریداران و فروشندگان",
    desc: "با ما، معاملات خود را سریع‌تر و مطمئن‌تر انجام دهید.",
    btn: "ثبت نام رایگان",
  },
  {
    bg: "from-[#7965C1] to-[#E3D095]",
    title: "تحلیل و مشاوره اقتصادی رایگان",
    desc: "از مشاوره و تحلیل‌های تخصصی ما برای تصمیم‌گیری بهتر بهره‌مند شوید.",
    btn: "دریافت مشاوره",
  },
];

const Auctions = () => {
  const [current, setCurrent] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [selectedAuction, setSelectedAuction] = useState(
    id ? auctions.find((auction) => auction.id === Number(id)) : null
  );
  const [filter, setFilter] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    nationalCode: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAuctionClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
    setSelectedAuction(auctions.find((auction) => auction.id === auctionId));
    setFormData({
      fullName: "",
      mobile: "",
      nationalCode: "",
    });
  };

  const handleBackClick = () => {
    setSelectedAuction(null);
    navigate("/auctions");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.mobile.trim() !== "" &&
      formData.nationalCode.trim() !== ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log("Form submitted:", formData);
    }
  };

  if (id && selectedAuction) {
    return (
      <div
        className={`min-h-screen py-6 sm:py-12 flex items-center justify-center transition-all duration-300 ${
          isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
        }`}
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBackClick}
            className="mb-4 sm:mb-6 cursor-pointer text-white hover:text-[#E3D095] transition-colors duration-300 flex items-center gap-2"
          >
            <span>←</span>
            <span>بازگشت به لیست</span>
          </button>

          <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-8 border border-[#E3D095]/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {selectedAuction.title}
              </h1>
              <span
                className={`rounded-full px-4 py-1 text-sm font-medium w-fit ${
                  selectedAuction.status === "فعال"
                    ? "bg-[#00A592]/20 text-[#00A592]"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {selectedAuction.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    توضیحات
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {selectedAuction.details}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    اطلاعات کلی
                  </h2>
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-600">قیمت پایه:</span>
                      <span
                        className={`font-semibold ${
                          selectedAuction.status === "فعال"
                            ? "text-[#00A592]"
                            : "text-red-500"
                        }`}
                      >
                        {selectedAuction.price} تومان
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مهلت ثبت نام:</span>
                      <span className="font-semibold">
                        <PersianDateTime dateTime={selectedAuction.deadline} />
                      </span>
                    </div>
                    {selectedAuction.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">موقعیت:</span>
                        <span className="font-semibold">
                          {selectedAuction.location}
                        </span>
                      </div>
                    )}
                    {selectedAuction.area && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">مساحت:</span>
                        <span className="font-semibold">
                          {selectedAuction.area}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    مدارک مورد نیاز
                  </h2>
                  <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base">
                    {selectedAuction.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    اطلاعات تماس
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {selectedAuction.contact}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  ثبت نام در مزایده
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={selectedAuction.status === "غیرفعال"}
                      className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent ${
                        selectedAuction.status === "غیرفعال"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره موبایل
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={selectedAuction.status === "غیرفعال"}
                      className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent ${
                        selectedAuction.status === "غیرفعال"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      کد ملی
                    </label>
                    <input
                      type="text"
                      name="nationalCode"
                      value={formData.nationalCode}
                      onChange={handleInputChange}
                      disabled={selectedAuction.status === "غیرفعال"}
                      className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3D095] focus:border-transparent ${
                        selectedAuction.status === "غیرفعال"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={
                      selectedAuction.status === "غیرفعال" || !isFormValid()
                    }
                    className={`w-full py-2 cursor-pointer px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base ${
                      selectedAuction.status === "فعال" && isFormValid()
                        ? "bg-[#00A592] text-white hover:bg-[#00A592]/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {selectedAuction.status === "فعال"
                      ? isFormValid()
                        ? "ثبت نام در مزایده"
                        : "لطفا تمام فیلدها را پر کنید"
                      : "غیرفعال"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotalValue = () => {
    return auctions
      .reduce((total, auction) => {
        const price = auction.price.replace(/[^\d]/g, "");
        return total + Number(price);
      }, 0)
      .toLocaleString("fa-IR");
  };

  const commercialStats = [
    {
      title: "کل مزایده‌ها",
      value: auctions.length,
      icon: "📊",
      color: "from-green-500/20 to-green-600/20",
    },
    {
      title: "مزایده‌های فعال",
      value: auctions.filter((a) => a.status === "فعال").length,
      icon: "✅",
      color: "from-green-500/20 to-green-600/20",
    },
    {
      title: "مزایده‌های غیرفعال",
      value: auctions.filter((a) => a.status === "غیرفعال").length,
      icon: "⏸",
      color: "from-green-500/20 to-green-600/20",
    },
    {
      title: "ارزش کل مزایده‌ها",
      value: `${calculateTotalValue()} تومان`,
      icon: "💰",
      color: "from-green-500/20 to-green-600/20",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-300 ${
        isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
      }`}
    >
      <div
        className={`w-full h-[165px] flex items-center justify-center bg-gradient-to-b ${slides[current].bg} text-white text-center py-4 px-4 transition-colors duration-700 overflow-hidden relative`}
      >
        <section>
          <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 drop-shadow-lg">
              {slides[current].title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-2 drop-shadow px-2">
              {slides[current].desc}
            </p>
            <button className="cursor-pointer bg-[#E3D095] hover:bg-[#E3D095]/90 text-[#0E2148] font-bold px-4 md:px-6 py-1 md:py-2 rounded-full shadow-lg transition-all duration-200 text-sm md:text-base">
              {slides[current].btn}
            </button>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full inline-block transition-all duration-300 border border-white ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setCurrent(i)}
                style={{ cursor: "pointer" }}
                aria-label={`اسلاید ${i + 1}`}
              ></span>
            ))}
          </div>
        </section>
      </div>
      <div className="flex-1 py-6 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialStats.map((stat, index) => (
              <div
                key={index}
                onClick={() => {
                  if (index === 0) setFilter(null);
                  else if (index === 1) setFilter("فعال");
                  else if (index === 2) setFilter("غیرفعال");
                }}
                className={`bg-gradient-to-br ${
                  stat.color
                } backdrop-blur-sm rounded-xl p-4 border border-[#00A592]/20 hover:scale-105 transition-transform duration-300 cursor-pointer ${
                  filter ===
                  (index === 1 ? "فعال" : index === 2 ? "غیرفعال" : null)
                    ? "ring-2 ring-white"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <h3 className="text-white/80 text-sm mb-1">{stat.title}</h3>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
            <div>
              <label htmlFor="">Search</label>
              <input type="search" name="" id="" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-[#00A592]/20 shadow-soft">
            <div className="mb-8 sm:mb-12">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {filter ? `مزایده های ${filter}` : "همه مزایده ها"}
                  </h2>
                  {filter && (
                    <button
                      onClick={() => setFilter(null)}
                      className="text-white/80 hover:text-white text-sm border border-white/20 rounded-lg px-3 py-1 hover:border-white/40 transition-colors duration-300 cursor-pointer"
                    >
                      حذف فیلتر
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {auctions
                  .filter((auction) => !filter || auction.status === filter)
                  .map((auction) => (
                    <div
                      key={auction.id}
                      className="bg-white rounded-2xl shadow-soft p-4 sm:p-6 hover:shadow-soft-lg transition-all duration-300 cursor-pointer border border-[#E3D095]/20"
                      onClick={() => handleAuctionClick(auction.id)}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        {auction.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {auction.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span
                          className={`text-base sm:text-lg font-bold ${
                            auction.status === "فعال"
                              ? "text-[#00A592]"
                              : "text-red-600"
                          }`}
                        >
                          {auction.price} تومان
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          مهلت:{" "}
                          <PersianDateTime
                            dateTime={auction.deadline}
                            showTime={false}
                          />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`bg-${
                            auction.status === "فعال" ? "green" : "red"
                          }-100 text-${
                            auction.status === "فعال" ? "green" : "red"
                          }-600 rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium`}
                        >
                          {auction.status}
                        </span>
                        <span
                          className={`${
                            auction.status === "فعال"
                              ? "text-[#00A592]"
                              : "text-red-500"
                          }`}
                        >
                          مشاهده جزئیات →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Section */}
      <ConsultationSection />
    </div>
  );
};

export default Auctions;
