import React from "react";

const PersianDateTime = ({ dateTime, showTime = true, className = "" }) => {
  // تبدیل تاریخ میلادی به شمسی
  const gregorianToPersian = (date) => {
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();

    // الگوریتم تبدیل تاریخ میلادی به شمسی
    let persianYear = gregorianYear - 621;
    let persianMonth = 1;
    let persianDay = 1;

    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const persianMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

    // محاسبه روزهای گذشته از ابتدای سال میلادی
    let dayOfYear = 0;
    for (let i = 0; i < gregorianMonth - 1; i++) {
      dayOfYear += monthDays[i];
    }
    dayOfYear += gregorianDay;

    // بررسی سال کبیسه
    if (
      gregorianMonth > 2 &&
      ((gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) ||
        gregorianYear % 400 === 0)
    ) {
      dayOfYear++;
    }

    // محاسبه سال شمسی
    if (dayOfYear <= 79) {
      persianYear--;
      dayOfYear += 286;
    } else {
      dayOfYear -= 79;
    }

    // محاسبه ماه و روز شمسی
    for (let i = 0; i < 12; i++) {
      if (dayOfYear <= persianMonthDays[i]) {
        persianMonth = i + 1;
        persianDay = dayOfYear;
        break;
      }
      dayOfYear -= persianMonthDays[i];
    }

    return { year: persianYear, month: persianMonth, day: persianDay };
  };

  // نام‌های ماه‌های فارسی
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
  const persianWeekDays = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
    "شنبه",
  ];

  if (!dateTime) {
    return <span className={className}>-</span>;
  }

  const date = new Date(dateTime);
  const persian = gregorianToPersian(date);
  const weekDay = persianWeekDays[date.getDay()];

  // فرمت زمان
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const persianDate = `${persian.day} ${persianMonths[persian.month - 1]} ${
    persian.year
  }`;
  const time = showTime ? ` ${formatTime(date)}` : "";

  return (
    <span className={className} title={`${weekDay} ${persianDate}${time}`}>
      {persianDate}
      {time}
    </span>
  );
};

export default PersianDateTime;
