import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaDesktop, FaTabletAlt, FaMobileAlt, FaTimes } from 'react-icons/fa';

const ResponsiveTester = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState('desktop');
  const { isDarkMode } = useTheme();

  const devices = [
    { name: 'desktop', icon: FaDesktop, width: '100%', label: 'دسکتاپ' },
    { name: 'tablet', icon: FaTabletAlt, width: '768px', label: 'تبلت' },
    { name: 'mobile', icon: FaMobileAlt, width: '375px', label: 'موبایل' }
  ];

  const getCurrentDevice = () => {
    const width = window.innerWidth;
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    return 'desktop';
  };

  useEffect(() => {
    const handleResize = () => {
      setCurrentDevice(getCurrentDevice());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Show responsive tester on development
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/90 border border-gray-700 text-white' 
        : 'bg-white/90 border border-gray-200 text-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">تست واکنش‌گرایی</h3>
        <button
          onClick={() => setIsVisible(false)}
          className={`p-1 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex space-x-2 space-x-reverse mb-3">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <button
              key={device.name}
              onClick={() => setCurrentDevice(device.name)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentDevice === device.name
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={device.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>دستگاه فعال:</span>
          <span className="font-bold">
            {devices.find(d => d.name === currentDevice)?.label}
          </span>
        </div>
        <div className="flex justify-between">
          <span>عرضه صفحه:</span>
          <span className="font-bold">{window.innerWidth}px</span>
        </div>
        <div className="flex justify-between">
          <span>ارتفاع صفحه:</span>
          <span className="font-bold">{window.innerHeight}px</span>
        </div>
      </div>

      <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-600 dark:text-blue-400">
          💡 برای تست کامل، اندازه پنجره مرورگر را تغییر دهید
        </p>
      </div>
    </div>
  );
};

export default ResponsiveTester;