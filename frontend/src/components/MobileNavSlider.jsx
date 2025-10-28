import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "صفحه نخست" },
  { to: "/auctions", label: "مزایده" },
  { to: "/trend", label: "مناقصه" },
  { to: "/inquiry", label: "استعلام" },
  { to: "/global", label: "تهیه اسناد منقصه" },
  { to: "/categories", label: "انتشار آگهی" },
  { to: "/insidemarket", label: "بازارهای داخلی" },
  { to: "/outsidemarket", label: "بازارهای خارجی" },
  { to: "/datanalysis", label: "تحلیل داده ها" },
  { to: "/news", label: "اخبار و قوانین" },
  { to: "/contact", label: "تماس با ما" },
  { to: "/cooperation", label: "همکاری با ما" },
];

const MobileNavSlider = () => (
  <div className="md:hidden w-full px-2 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `inline-block transition-colors duration-200 px-3 py-1 rounded-lg mx-1 text-sm font-medium cursor-pointer ${
            isActive
              ? "bg-[#E3D095] text-[#0E2148] font-bold"
              : "text-white hover:text-[#E3D095] hover:bg-[#E3D095]/10"
          }`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </div>
);

export default MobileNavSlider; 