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

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeStatKey, setActiveStatKey] = useState(null);
  const [sortKey, setSortKey] = useState("deadline_desc");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, filter, sortKey]);

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

  const q = debouncedQuery.trim().toLowerCase();
  const visibleAuctions = auctions
    .filter((a) => !filter || a.status === filter)
    .filter(
      (a) =>
        !q ||
        [
          a.title,
          a.description,
          a.location,
          a.brand,
          a.model,
          a.category,
          a.type,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
    );

  const toEnglishDigits = (str) =>
    String(str)
      .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
      .replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);

  const parsePrice = (price) => {
    if (!price) return 0;
    const digits = toEnglishDigits(price).replace(/[^0-9]/g, "");
    return Number(digits || 0);
  };

  const sortedAuctions = [...visibleAuctions].sort((a, b) => {
    switch (sortKey) {
      case "deadline_asc":
        return new Date(a.deadline) - new Date(b.deadline);
      case "deadline_desc":
        return new Date(b.deadline) - new Date(a.deadline);
      case "price_asc":
        return parsePrice(a.price) - parsePrice(b.price);
      case "price_desc":
        return parsePrice(b.price) - parsePrice(a.price);
      case "title_asc":
        return String(a.title).localeCompare(String(b.title), "fa");
      case "title_desc":
        return String(b.title).localeCompare(String(a.title), "fa");
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedAuctions.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageAuctions = sortedAuctions.slice(startIndex, startIndex + pageSize);

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
      .reduce((total, auction) => total + parsePrice(auction.price), 0)
      .toLocaleString("fa-IR");
  };

  const calculateActiveTotalValue = () => {
    return auctions
      .filter((a) => a.status === "فعال")
      .reduce((total, auction) => total + parsePrice(auction.price), 0)
      .toLocaleString("fa-IR");
  };

  const calculateAveragePrice = () => {
    if (!auctions.length) return "0";
    const sum = auctions.reduce(
      (total, auction) => total + parsePrice(auction.price),
      0
    );
    return Math.round(sum / auctions.length).toLocaleString("fa-IR");
  };

  const highestPrice = () => {
    const max = Math.max(...auctions.map((a) => parsePrice(a.price)));
    return (isFinite(max) ? max : 0).toLocaleString("fa-IR");
  };

  const endingSoonCount = () => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return auctions.filter((a) => {
      const deadline = new Date(a.deadline).getTime();
      return (
        a.status === "فعال" && deadline >= now && deadline - now <= sevenDays
      );
    }).length;
  };

  const commercialStats = [
    {
      key: "all",
      title: "کل مزایده‌ها",
      value: auctions.length,
      icon: "📊",
      color: "from-green-500/20 to-green-600/20",
      onClick: () => setFilter(null),
      isActive: () => filter === null,
      hint: "نمایش همه",
    },
    {
      key: "active",
      title: "مزایده‌های فعال",
      value: auctions.filter((a) => a.status === "فعال").length,
      icon: "✅",
      color: "from-green-500/20 to-green-600/20",
      onClick: () => setFilter("فعال"),
      isActive: () => filter === "فعال",
      hint: "فقط فعال‌ها",
    },
    {
      key: "inactive",
      title: "مزایده‌های غیرفعال",
      value: auctions.filter((a) => a.status === "غیرفعال").length,
      icon: "⏸",
      color: "from-green-500/20 to-green-600/20",
      onClick: () => setFilter("غیرفعال"),
      isActive: () => filter === "غیرفعال",
      hint: "فقط غیرفعال‌ها",
    },
    {
      key: "total_value",
      title: "ارزش کل مزایده‌ها",
      value: `${calculateTotalValue()} تومان`,
      icon: "💰",
      color: "from-yellow-500/20 to-yellow-600/20",
      onClick: () => setSortKey("price_desc"),
      isActive: () => sortKey === "price_desc",
      hint: "مرتب‌سازی بر اساس بیشترین قیمت",
    },
    {
      key: "active_value",
      title: "ارزش مزایده‌های فعال",
      value: `${calculateActiveTotalValue()} تومان`,
      icon: "📈",
      color: "from-blue-500/20 to-blue-600/20",
      onClick: () => setFilter("فعال"),
      isActive: () => filter === "فعال",
      hint: "نمایش فقط فعال‌ها",
    },
    {
      key: "ending_soon",
      title: "رو به پایان (۷ روز)",
      value: endingSoonCount(),
      icon: "⏰",
      color: "from-red-500/20 to-red-600/20",
      onClick: () => setSortKey("deadline_asc"),
      isActive: () => sortKey === "deadline_asc",
      hint: "نزدیک‌ترین مهلت‌ها",
    },
    {
      key: "avg_price",
      title: "میانگین قیمت",
      value: `${calculateAveragePrice()} تومان`,
      icon: "📐",
      color: "from-purple-500/20 to-purple-600/20",
      onClick: () => setSortKey("price_desc"),
      isActive: () => sortKey === "price_desc",
      hint: "مرتب‌سازی بر اساس قیمت",
    },
    {
      key: "max_price",
      title: "بیشترین قیمت",
      value: `${highestPrice()} تومان`,
      icon: "🏆",
      color: "from-orange-500/20 to-orange-600/20",
      onClick: () => setSortKey("price_desc"),
      isActive: () => sortKey === "price_desc",
      hint: "نمایش گران‌ترین‌ها",
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
                role="button"
                tabIndex={0}
                aria-pressed={activeStatKey === stat.key}
                aria-label={`${stat.title}${
                  stat.hint ? ` - ${stat.hint}` : ""
                }`}
                onClick={() => {
                  setActiveStatKey(stat.key);
                  stat.onClick && stat.onClick();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveStatKey(stat.key);
                    stat.onClick && stat.onClick();
                  }
                }}
                className={`bg-gradient-to-br ${
                  stat.color
                } backdrop-blur-sm rounded-xl p-4 border border-[#00A592]/20 hover:scale-105 transition-transform duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isDarkMode
                    ? "focus-visible:ring-white/70 focus-visible:ring-offset-white/10"
                    : "focus-visible:ring-indigo-500 focus-visible:ring-offset-black/5"
                } ${
                  activeStatKey === stat.key
                    ? isDarkMode
                      ? "ring-2 ring-white/70 ring-offset-2 ring-offset-white/10"
                      : "ring-2 ring-indigo-500 ring-offset-2 ring-offset-black/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <h3 className="text-white/80 text-sm mb-1">{stat.title}</h3>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                    {stat.hint && (
                      <p className="text-white/60 text-xs mt-1">{stat.hint}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4">
              <label
                htmlFor="auctions-search"
                className="block text-white/80 text-sm mb-2"
              >
                جستجو
              </label>
              <div className="relative">
                <input
                  id="auctions-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchQuery("");
                  }}
                  placeholder="جستجو در عنوان، توضیحات یا موقعیت..."
                  className="w-full rounded-xl bg-white/10 border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 text-white placeholder-white/50 px-10 py-3 outline-none transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 4a7 7 0 105.292 12.042l3.333 3.333a1 1 0 001.414-1.414l-3.333-3.333A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
                    aria-label="پاک کردن جستجو"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <p className="text-white/70 text-sm md:col-span-1">
                  {sortedAuctions.length} مزایده یافت شد
                </p>
                <div className="flex items-center gap-2 md:col-span-1">
                  <label
                    className={`${
                      isDarkMode ? "text-white/80" : "text-gray-800"
                    } text-sm`}
                  >
                    مرتب‌سازی:
                  </label>
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    className={`flex-1 rounded-lg bg-white/10 border border-white/20 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } text-sm px-3 py-2 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none`}
                  >
                    <option value="deadline_desc">مهلت: جدید → قدیم</option>
                    <option value="deadline_asc">مهلت: قدیم → جدید</option>
                    <option value="price_desc">قیمت: بالا → پایین</option>
                    <option value="price_asc">قیمت: پایین → بالا</option>
                    <option value="title_asc">عنوان: الفبا A→Z</option>
                    <option value="title_desc">عنوان: الفبا Z→A</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 md:col-span-1">
                  <label
                    className={`${
                      isDarkMode ? "text-white/80" : "text-gray-800"
                    } text-sm`}
                  >
                    تعداد در صفحه:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className={`rounded-lg bg-white/10 border border-white/20 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } text-sm px-3 py-2 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none`}
                  >
                    <option value={6}>۶</option>
                    <option value={9}>۹</option>
                    <option value={12}>۱۲</option>
                  </select>
                </div>
              </div>
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
              {sortedAuctions.length === 0 ? (
                <div className="text-center text-white/80 py-10">
                  <p className="mb-4">هیچ مزایده‌ای مطابق با جستجو یافت نشد.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setFilter(null);
                    }}
                    className="cursor-pointer border border-white/20 rounded-lg px-4 py-2 text-white hover:border-white/40 transition-colors"
                  >
                    پاک کردن فیلترها
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pageAuctions.map((auction) => (
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
              )}
              {sortedAuctions.length > 0 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    className="cursor-pointer px-3 py-1 rounded-lg text-white border border-white/20 hover:border-white/40 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    قبلی
                  </button>
                  <span className="text-white/80 text-sm">
                    صفحه {currentPage} از {totalPages}
                  </span>
                  <button
                    className="cursor-pointer px-3 py-1 rounded-lg text-white border border-white/20 hover:border-white/40 disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    بعدی
                  </button>
                </div>
              )}
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
