import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const rowHeight = 44;
const ROWS_TO_SHOW = 6;

const formatNumber = (num) => num.toLocaleString("fa-IR");

const CardTable = ({ title, date, prices, unit, slideInterval = 2000 }) => {
  const { isDarkMode } = useTheme();
  const [startIdx, setStartIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setResetting(true);
        setStartIdx((prev) => (prev + 1) % prices.length);
        setTimeout(() => setResetting(false), 8);
      }, 1000);
    }, slideInterval);
    return () => clearInterval(interval);
  }, [prices, slideInterval]);

  const translateY = animating ? -rowHeight : 0;
  const transition = animating
    ? "transform 1s ease-in-out"
    : resetting
    ? "none"
    : "none";

  // Build a double list for smooth looping
  const doubleRows = [...prices, ...prices].slice(
    startIdx,
    startIdx + ROWS_TO_SHOW + 1 // +1 for the sliding out row
  );

  return (
    <section className="bg-white rounded-2xl shadow-soft mb-4 md:mb-8 overflow-hidden border border-gray-200 flex-1 min-w-[280px] md:min-w-0 max-w-[420px] mx-auto cursor-pointer hover:shadow-soft-lg transition-all duration-200">
      <div className={`text-white text-center py-3 px-2 transition-all duration-300 ${
        isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
      }`}>
        <div className="font-bold text-base md:text-lg">{title}</div>
        <div className="text-[10px] md:text-xs mt-1 opacity-90">{date}</div>
      </div>
      <div className="relative">
        <table className="w-full text-center text-xs md:text-sm rtl table-fixed">
          <thead>
            <tr className={`text-white transition-all duration-300 ${
              isDarkMode ? "bg-[#0E2148]" : "bg-[#604bfb]"
            }`}>
              <th className="py-2 px-1 w-[40%]">نوع</th>
              <th className="py-2 px-1 w-[20%]">خرده بار</th>
              <th className="py-2 px-1 w-[20%]">عمده بار</th>
              <th className="py-2 px-1 w-[20%]">{unit}</th>
            </tr>
          </thead>
        </table>
        <div
          className="overflow-hidden"
          style={{ height: `${rowHeight * ROWS_TO_SHOW}px` }}
        >
          <table className="w-full text-center text-xs md:text-sm rtl table-fixed">
            <tbody
              style={{
                transform: `translateY(${translateY}px)`,
                transition,
              }}
            >
              {doubleRows.map((row, i) => {
                // Calculate the true index in the original prices array
                const trueIdx = (startIdx + i) % prices.length;
                return (
                  <tr
                    key={i}
                    className={`${
                      trueIdx % 2 === 1 ? "bg-gray-50" : "bg-white"
                    } text-gray-900`}
                    style={{ height: `${rowHeight}px` }}
                  >
                    <td className="py-2 px-1 w-[40%]">
                      <Link
                        to={`/search?type=${encodeURIComponent(row.type)}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150 text-xs md:text-sm"
                      >
                        {row.type}
                      </Link>
                    </td>
                    <td className="py-2 px-1 w-[20%]">
                      {formatNumber(row.retail)}
                    </td>
                    <td className="py-2 px-1 w-[20%]">
                      {formatNumber(row.wholesale)}
                    </td>
                    <td className="py-2 px-1 w-[20%] text-gray-600 text-[10px] md:text-xs">
                      تومان
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// Example data for each card
const nonMetal = [
  { type: "نایلون درجه یک", retail: 18846, wholesale: 24693 },
  { type: "سبد در هم", retail: 12646, wholesale: 18183 },
  { type: "فلّه کارتن", retail: 13780, wholesale: 16134 },
  { type: "کاغذ سفید / فرم", retail: 17028, wholesale: 20359 },
  { type: "روزنامه باطله نو", retail: 20500, wholesale: 25500 },
  { type: "پت هاتواش، زیر ۲۰۰", retail: 48750, wholesale: 48900 },
  { type: "پت زنده درجه یک", retail: 18789, wholesale: 20479 },
  { type: "پت زنده درجه دو", retail: 15940, wholesale: 17249 },
];
const metal = [
  { type: "آهن سوپر ویژه", retail: 17949, wholesale: 20042 },
  { type: "آهن درجه یک", retail: 15592, wholesale: 17949 },
  { type: "آهن درجه دو", retail: 13859, wholesale: 15846 },
  { type: "چدن درشت بار", retail: 15140, wholesale: 17879 },
  { type: "آلومینیوم نرم", retail: 15140, wholesale: 17879 },
  { type: "آلومینیوم خشک", retail: 17249, wholesale: 20479 },
  { type: "مس کابل قرمز", retail: 95987, wholesale: 112478 },
];
const electronic = [
  { type: "پی سی بی اس", retail: 86650, wholesale: 96466 },
  { type: "برد موبایل اصل", retail: 559200, wholesale: 703700 },
  { type: "برد موبایل در هم", retail: 155000, wholesale: 203700 },
  { type: "سی پی یو - CPU", retail: 150000, wholesale: 186467 },
  { type: "مادر برد (دو چیپ)", retail: 80000, wholesale: 120000 },
  { type: "برد سبز", retail: 35000, wholesale: 45000 },
  { type: "کارتن خشک - ایرانی", retail: 25000, wholesale: 30000 },
];

const NonMetalScrapPrices = () => (
  <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch my-4 md:my-8 px-2 md:px-0">
    <CardTable
      title="قیمت طلا و ارز"
      color="bg-blue-500"
      date="۱۴۰۴/۰۳/۰۵"
      prices={electronic}
      unit="تومان"
      slideInterval={2000}
    />
    <CardTable
      title="بازار ارز دیجیتال"
      color="bg-blue-500"
      date="۱۴۰۴/۰۳/۰۵"
      prices={nonMetal}
      unit="تومان"
      slideInterval={5000}
    />
    <CardTable
      title="بازار فلزات پایه"
      color="bg-blue-500"
      date="۱۴۰۴/۰۳/۰۵"
      prices={metal}
      unit="تومان"
      slideInterval={8000}
    />
  </div>
);

export default NonMetalScrapPrices;
