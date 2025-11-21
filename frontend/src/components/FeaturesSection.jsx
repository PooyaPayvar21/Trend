import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaGavel,
  FaCar,
  FaGem,
  FaIndustry,
  FaHome,
  FaFileContract,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";

const fallbackFeatures = [
  {
    title: "بررسی‌های مجازی",
    description: "بررسی و مشاهده کالاها به صورت آنلاین با کیفیت بالا",
    icon: FaGavel,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    category: "خدمات IT",
    location: "تهران",
    deadline: "1404/09/05",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های خودرو",
    description: "شرکت در مزایده‌های خودروهای مختلف با ضمانت",
    icon: FaCar,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    category: "خودرو",
    location: "تهران",
    deadline: "1404/08/25",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های وسایل و ساعت",
    description: "دسترسی به مزایده‌های وسایل لوکس و ساعتهای گرانقیمت",
    icon: FaGem,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    category: "لوکس",
    location: "اصفهان",
    deadline: "1404/09/10",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های رویدادهای صنعتی",
    description: "شرکت در مزایده‌های تجهیزات و رویدادهای صنعتی",
    icon: FaIndustry,
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    category: "صنعت",
    location: "تبریز",
    deadline: "1404/09/15",
    featured: true,
    type: "auction",
  },
  {
    title: "مزایده‌های ملک",
    description: "خرید و فروش املاک از طریق مزایده با مشاوره تخصصی",
    icon: FaHome,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    category: "املاک",
    location: "شیراز",
    deadline: "1404/09/20",
    featured: true,
    type: "auction",
  },
  {
    title: "ثبت قرارداد برای ایران",
    description: "امکان ثبت و مشاهده قراردادها با امنیت بالا",
    icon: FaFileContract,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    category: "قرارداد",
    location: "مشهد",
    deadline: "1404/09/30",
    featured: true,
    type: "tender",
  },
];

const FeaturesSection = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [items, setItems] = useState(fallbackFeatures);
  const [revealed, setRevealed] = useState({});
  const toFa = (n) => new Intl.NumberFormat("fa-IR").format(n);

  useEffect(() => {
    const load = async () => {
      try {
        const { default: api } = await import("../api/index");
        const res = await api.get("/auctions/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];
        const pickIcon = (a) => {
          const cat = String(a.category || "").toLowerCase();
          const isTender = String(a.condition || "").toLowerCase() === "tender";
          if (isTender) return FaFileContract;
          if (cat.includes("خودرو") || cat.includes("car")) return FaCar;
          if (cat.includes("لوکس") || cat.includes("lux")) return FaGem;
          if (cat.includes("صنعت") || cat.includes("industry"))
            return FaIndustry;
          if (
            cat.includes("املاک") ||
            cat.includes("home") ||
            cat.includes("estate")
          )
            return FaHome;
          return FaGavel;
        };
        const palette = (IconComp, isTender) => {
          if (IconComp === FaCar)
            return {
              color: "from-red-500 to-pink-500",
              bgColor: "bg-red-50",
              textColor: "text-red-600",
            };
          if (IconComp === FaGem)
            return {
              color: "from-purple-500 to-indigo-500",
              bgColor: "bg-purple-50",
              textColor: "text-purple-600",
            };
          if (IconComp === FaIndustry)
            return {
              color: "from-orange-500 to-yellow-500",
              bgColor: "bg-orange-50",
              textColor: "text-orange-600",
            };
          if (IconComp === FaHome)
            return {
              color: "from-green-500 to-teal-500",
              bgColor: "bg-green-50",
              textColor: "text-green-600",
            };
          if (isTender)
            return {
              color: "from-indigo-500 to-blue-500",
              bgColor: "bg-indigo-50",
              textColor: "text-indigo-600",
            };
          return {
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
          };
        };
        const mapped = data.map((a) => {
          const icon = pickIcon(a);
          const isTender = String(a.condition || "").toLowerCase() === "tender";
          const p = palette(icon, isTender);
          const endMs = a.end_date ? new Date(a.end_date).getTime() : 0;
          const daysLeft = endMs
            ? (endMs - Date.now()) / (1000 * 60 * 60 * 24)
            : null;
          const hasBids =
            Number(a.current_price || 0) > Number(a.starting_price || 0);
          const endsSoon = typeof daysLeft === "number" && daysLeft <= 3;
          return {
            id: a.id,
            title: a.title,
            description: a.description,
            icon,
            color: p.color,
            bgColor: p.bgColor,
            textColor: p.textColor,
            category: a.category || "",
            location: a.location || "",
            deadline: a.end_date
              ? new Date(a.end_date).toLocaleDateString("fa-IR")
              : "",
            featured: Boolean(endsSoon || hasBids),
            starting_price: a.starting_price,
            current_price: a.current_price,
            daysLeft:
              typeof daysLeft === "number"
                ? Math.max(0, Math.ceil(daysLeft))
                : null,
            type: isTender ? "tender" : "auction",
          };
        });
        setItems(
          mapped.slice(0, 6).length ? mapped.slice(0, 6) : fallbackFeatures
        );
      } catch (e) {
        setItems(fallbackFeatures);
      }
    };
    load();
  }, []);

  const handleCardClick = (feature) => {
    if (feature?.type === "tender") {
      if (feature?.id) navigate(`/trend/${feature.id}`);
      else navigate("/create-tender", { state: { feature } });
    } else {
      if (feature?.id) navigate(`/auctions/${feature.id}`);
      else navigate("/create-auction", { state: { feature } });
    }
  };

  const handleKeyDown = (e, feature) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(feature);
    }
  };

  return (
    <section
      className={`py-16 transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-400 via-white to-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full mb-6 ${
              isDarkMode
                ? "bg-blue-900/50 text-blue-300"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <span className="text-sm font-medium">خدمات برتر</span>
            <span>⭐</span>
          </div>
          <h2
            className={`text-4xl lg:text-5xl font-bold mb-6 transition-all duration-300 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            آگهی های ویژه
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            دسترسی به جدیدترین آگهی های فعال در سراسر کشور با بالاترین
            استانداردهای امنیتی و کیفیتی
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-12">
          {[
            {
              key: "car",
              label: "مزایده‌های خودرو",
              match: (x) =>
                String(x.category || "").includes("خودرو") ||
                String(x.category || "")
                  .toLowerCase()
                  .includes("car"),
            },
            {
              key: "estate",
              label: "مزایده‌های ملک",
              match: (x) =>
                String(x.category || "").includes("املاک") ||
                String(x.category || "")
                  .toLowerCase()
                  .includes("estate") ||
                String(x.category || "")
                  .toLowerCase()
                  .includes("home"),
            },
            {
              key: "sim-sell",
              label: "فروش سیم کارت",
              match: (x) =>
                (String(x.category || "").includes("سیم کارت") ||
                  String(x.category || "")
                    .toLowerCase()
                    .includes("sim")) &&
                x.type === "auction",
            },
            {
              key: "sim-buy",
              label: "خرید سیم کارت",
              match: (x) =>
                (String(x.category || "").includes("سیم کارت") ||
                  String(x.category || "")
                    .toLowerCase()
                    .includes("sim")) &&
                x.type === "tender",
            },
          ].map((group) => {
            const groupItemsAll = items
              .filter((it) => it.featured)
              .filter((it) => group.match(it));
            const groupItems = groupItemsAll.slice(0, 5);
            if (!groupItems.length) return null;
            const firstFour = groupItems.slice(0, 4);
            const fifth = groupItems[4];
            return (
              <div key={group.key}>
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      const target = (() => {
                        if (group.key === "car")
                          return "/auctions?category=خودرو&type=auction";
                        if (group.key === "estate")
                          return "/auctions?category=املاک&type=auction";
                        if (group.key === "sim-sell")
                          return "/auctions?category=سیم کارت&type=auction";
                        if (group.key === "sim-buy")
                          return "/trend?category=سیم کارت&type=tender";
                        return "/auctions";
                      })();
                      navigate(target);
                    }}
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {group.label}
                  </button>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {toFa(Math.min(4, groupItemsAll.length))} از{" "}
                      {toFa(groupItemsAll.length)} ویژه
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const target = (() => {
                          if (group.key === "car")
                            return "/auctions?category=خودرو&type=auction";
                          if (group.key === "estate")
                            return "/auctions?category=املاک&type=auction";
                          if (group.key === "sim-sell")
                            return "/auctions?category=سیم کارت&type=auction";
                          if (group.key === "sim-buy")
                            return "/trend?category=سیم کارت&type=tender";
                          return "/auctions";
                        })();
                        navigate(target);
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
                        isDarkMode
                          ? "text-black bg-[#E3D095] hover:bg-[#E3D095]/80"
                          : "text-white bg-primary-600 hover:bg-primary-700"
                      }`}
                    >
                      مشاهده همه
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {firstFour.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Link
                        key={`${group.key}-${index}`}
                        to={`/auctions?category=${encodeURIComponent(
                          String(feature.category || "")
                        )}&type=${
                          feature.type === "tender" ? "tender" : "auction"
                        }`}
                        state={{ feature }}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleCardClick(feature)}
                        onKeyDown={(e) => handleKeyDown(e, feature)}
                        dir="rtl"
                        className={`rounded-2xl overflow-hidden transition-all duration-300 group block no-underline focus:outline-none border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-200 bg-white"
                        }`}
                        aria-label={`مشاهده آگهی: ${feature.title}`}
                      >
                        <div
                          className={`h-16 bg-gradient-to-br ${feature.color} flex items-center justify-between px-4`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isDarkMode
                                ? "bg-white/10 text-white"
                                : "bg-white/30 text-white"
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="text-white text-xs px-2 py-1 rounded-lg bg-black/20">
                            ویژه
                          </div>
                        </div>
                        <div className="p-5">
                          <div
                            className={`text-base font-bold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {feature.title}
                          </div>
                          <div
                            className={`text-sm mb-4 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {feature.description}
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-xs">
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  isDarkMode
                                    ? "bg-gray-700 text-gray-100"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {feature.category}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  isDarkMode
                                    ? "bg-gray-700 text-gray-100"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {feature.location}
                              </span>
                            </div>
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {feature.deadline}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              قیمت:{" "}
                              {toFa(
                                feature.current_price || feature.starting_price
                              )}
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              باقی‌مانده:{" "}
                              {feature.daysLeft != null
                                ? toFa(feature.daysLeft) + " روز"
                                : ""}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {fifth && !revealed[group.key] && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((prev) => ({ ...prev, [group.key]: true }))
                      }
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        isDarkMode
                          ? "text-black bg-[#E3D095] hover:bg-[#E3D095]/80 focus:ring-2 focus:ring-[#E3D095]"
                          : "text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
                      }`}
                    >
                      نمایش بیشتر
                    </button>
                  </div>
                )}
                {fifth && revealed[group.key] && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      {(() => {
                        const feature = fifth;
                        const IconComponent = feature.icon;
                        return (
                          <Link
                            key={`${group.key}-fifth`}
                            to={`/auctions?category=${encodeURIComponent(
                              String(feature.category || "")
                            )}&type=${
                              feature.type === "tender" ? "tender" : "auction"
                            }`}
                            state={{ feature }}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleCardClick(feature)}
                            onKeyDown={(e) => handleKeyDown(e, feature)}
                            dir="rtl"
                            className={`rounded-2xl overflow-hidden transition-all duration-300 group block no-underline focus:outline-none border ${
                              isDarkMode
                                ? "border-gray-700 bg-gray-800"
                                : "border-gray-200 bg-white"
                            }`}
                            aria-label={`مشاهده آگهی: ${feature.title}`}
                          >
                            <div
                              className={`h-16 bg-gradient-to-br ${feature.color} flex items-center justify-between px-4`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isDarkMode
                                    ? "bg-white/10 text-white"
                                    : "bg-white/30 text:white"
                                }`}
                              >
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="text-white text-xs px-2 py-1 rounded-lg bg-black/20">
                                ویژه
                              </div>
                            </div>
                            <div className="p-5">
                              <div
                                className={`text-base font-bold mb-2 ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                              >
                                {feature.title}
                              </div>
                              <div
                                className={`text-sm mb-4 ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {feature.description}
                              </div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-xs">
                                  <span
                                    className={`px-2 py-1 rounded-full ${
                                      isDarkMode
                                        ? "bg-gray-700 text-gray-100"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {feature.category}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full ${
                                      isDarkMode
                                        ? "bg-gray-700 text-gray-100"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {feature.location}
                                  </span>
                                </div>
                                <div
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {feature.deadline}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                  }`}
                                >
                                  قیمت:{" "}
                                  {toFa(
                                    feature.current_price ||
                                      feature.starting_price
                                  )}
                                </div>
                                <div
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                  }`}
                                >
                                  باقی‌مانده:{" "}
                                  {feature.daysLeft != null
                                    ? toFa(feature.daysLeft) + " روز"
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
