import React, { useState, useRef, useEffect } from "react";
import { FaCalendar } from "react-icons/fa";

const PersianDatePicker = ({
  value,
  onChange,
  placeholder,
  required,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const pickerRef = useRef(null);

  // تولید روزهای ماه
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // نام‌های ماه‌های شمسی
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // نام‌های روزهای هفته
  const persianWeekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  const handleDateSelect = (day) => {
    const persianDate = `${currentYear}/${String(currentMonth + 1).padStart(
      2,
      "0"
    )}/${String(day).padStart(2, "0")}`;
    setSelectedDate(persianDate);
    onChange(persianDate);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    onChange(value);
  };

  // بستن picker با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const days = getDaysInMonth(currentYear, currentMonth);

  return (
    <div className="relative" ref={pickerRef}>
      <div className="relative">
        <input
          type="text"
          value={selectedDate}
          onChange={handleInputChange}
          placeholder={placeholder || "انتخاب تاریخ"}
          required={required}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent ${className}`}
          readOnly
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FaCalendar size={16} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              type="button"
              onClick={() =>
                setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
              }
              className="p-2 hover:bg-gray-100 rounded"
            >
              ‹
            </button>
            <div className="text-center">
              <div className="font-bold">{persianMonths[currentMonth]}</div>
              <div className="text-sm text-gray-600">{currentYear}</div>
            </div>
            <button
              type="button"
              onClick={() =>
                setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
              }
              className="p-2 hover:bg-gray-100 rounded"
            >
              ›
            </button>
          </div>

          {/* Year Navigation */}
          <div className="flex items-center justify-between p-2 border-b">
            <button
              type="button"
              onClick={() => setCurrentYear((prev) => prev - 1)}
              className="p-1 hover:bg-gray-100 rounded text-sm"
            >
              سال قبل
            </button>
            <button
              type="button"
              onClick={() => setCurrentYear((prev) => prev + 1)}
              className="p-1 hover:bg-gray-100 rounded text-sm"
            >
              سال بعد
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {persianWeekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-600 p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className="p-2 text-sm hover:bg-[#E3D095]/20 rounded transition-colors"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;
