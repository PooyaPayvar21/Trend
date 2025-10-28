import React, { useState, useRef, useEffect } from "react";
import { FaClock } from "react-icons/fa";

const PersianTimePicker = ({
  value,
  onChange,
  placeholder,
  required,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value || "");
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const pickerRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleTimeSelect = (hour, minute) => {
    const timeString = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    setSelectedTime(timeString);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange(timeString);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedTime(value);
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

  return (
    <div className="relative" ref={pickerRef}>
      <div className="relative">
        <input
          type="text"
          value={selectedTime}
          onChange={handleInputChange}
          placeholder={placeholder || "انتخاب زمان"}
          required={required}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent ${className}`}
          readOnly
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FaClock size={16} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-64">
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900">انتخاب زمان</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ساعت
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      onClick={() => handleTimeSelect(hour, selectedMinute)}
                      className={`w-full p-2 text-sm hover:bg-[#E3D095]/20 transition-colors ${
                        selectedHour === hour
                          ? "bg-[#E3D095] text-black font-bold"
                          : ""
                      }`}
                    >
                      {String(hour).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دقیقه
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      onClick={() => handleTimeSelect(selectedHour, minute)}
                      className={`w-full p-2 text-sm hover:bg-[#E3D095]/20 transition-colors ${
                        selectedMinute === minute
                          ? "bg-[#E3D095] text-black font-bold"
                          : ""
                      }`}
                    >
                      {String(minute).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Time Buttons */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-2">
                {["09:00", "12:00", "15:00", "18:00", "21:00", "00:00"].map(
                  (time) => (
                    <button
                      key={time}
                      onClick={() => {
                        const [hour, minute] = time.split(":").map(Number);
                        handleTimeSelect(hour, minute);
                      }}
                      className="p-2 text-sm bg-gray-100 hover:bg-[#E3D095]/20 rounded transition-colors"
                    >
                      {time}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianTimePicker;
