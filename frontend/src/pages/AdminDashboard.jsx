import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  getAdminDashboard,
  getAdminUsers,
  getAdminAuctions,
  getAdminBids,
  getAdminNotifications,
  getAdminCurrencies,
  adminBulkAction,
  adminExportData,
} from "../api/admin";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Sorting and pagination state
  const [userSort, setUserSort] = useState({ key: "created_at", dir: "desc" });
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const [auctionSort, setAuctionSort] = useState({
    key: "created_at",
    dir: "desc",
  });
  const [auctionPage, setAuctionPage] = useState(1);
  const [auctionPageSize, setAuctionPageSize] = useState(10);
  // Chart controls
  const [chartRange, setChartRange] = useState(30); // days: 7, 30, 90
  const [showMA, setShowMA] = useState(true); // moving average overlay

  useEffect(() => {
    if (user && user.is_admin) {
      loadDashboardData();
    } else if (user && !user.is_admin) {
      console.log("کاربر ادمین نیست:", user);
    } else if (!user) {
      console.log("کاربر لاگین نکرده است");
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboard();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("خطا در بارگذاری داده‌های داشبورد:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers({ search: searchTerm });
      setUsers(data);
    } catch (error) {
      console.error("خطا در بارگذاری کاربران:", error);
    }
  };

  const loadAuctions = async () => {
    try {
      const data = await getAdminAuctions({ search: searchTerm });
      setAuctions(data);
    } catch (error) {
      console.error("خطا در بارگذاری مزایده‌ها:", error);
    }
  };

  const loadBids = async () => {
    try {
      const data = await getAdminBids({ search: searchTerm });
      setBids(data);
    } catch (error) {
      console.error("خطا در بارگذاری پیشنهادات:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await getAdminNotifications({ search: searchTerm });
      setNotifications(data);
    } catch (error) {
      console.error("خطا در بارگذاری اعلان‌ها:", error);
    }
  };

  const loadCurrencies = async () => {
    try {
      const data = await getAdminCurrencies({ search: searchTerm });
      setCurrencies(data);
    } catch (error) {
      console.error("خطا در بارگذاری ارزها:", error);
    }
  };

  const handleBulkAction = async (action, modelType) => {
    if (selectedItems.length === 0) {
      toast.error("لطفاً مواردی را انتخاب کنید");
      return;
    }

    const confirmed = window.confirm("آیا از انجام عملیات مطمئن هستید؟");
    if (!confirmed) return;

    try {
      await adminBulkAction(action, modelType, selectedItems);
      setSelectedItems([]);
      switch (activeTab) {
        case "users":
          await loadUsers();
          break;
        case "auctions":
          await loadAuctions();
          break;
        case "bids":
          await loadBids();
          break;
        case "notifications":
          await loadNotifications();
          break;
        case "currencies":
          await loadCurrencies();
          break;
        default:
          break;
      }

      toast.success("عملیات با موفقیت انجام شد");
    } catch (error) {
      console.error("خطا در انجام عملیات گروهی:", error);
      toast.error("خطا در انجام عملیات");
    }
  };

  const handleExportData = async (modelType) => {
    try {
      const data = await adminExportData(modelType);

      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${modelType}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("صادرات با موفقیت انجام شد");
    } catch (error) {
      console.error("خطا در صادرات داده:", error);
      toast.error("خطا در صادرات داده");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItems([]);
    setSearchTerm("");
    setUserPage(1);
    setAuctionPage(1);

    switch (tab) {
      case "users":
        loadUsers();
        break;
      case "auctions":
        loadAuctions();
        break;
      case "bids":
        loadBids();
        break;
      case "notifications":
        loadNotifications();
        break;
      case "currencies":
        loadCurrencies();
        break;
      case "overview":
        // Preload lists used by overview widgets
        loadUsers();
        loadAuctions();
        break;
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    let currentItems = [];
    switch (activeTab) {
      case "users":
        currentItems = users.map((user) => user.id);
        break;
      case "auctions":
        currentItems = auctions.map((auction) => auction.id);
        break;
      case "bids":
        currentItems = bids.map((bid) => bid.id);
        break;
      case "notifications":
        currentItems = notifications.map((notification) => notification.id);
        break;
      case "currencies":
        currentItems = currencies.map((currency) => currency.id);
        break;
    }

    setSelectedItems(
      selectedItems.length === currentItems.length ? [] : currentItems
    );
  };

  // Helpers: sorting and pagination
  const sortBy = (arr, { key, dir }) => {
    const copy = [...arr];
    copy.sort((a, b) => {
      const va = a?.[key];
      const vb = b?.[key];
      const aa = va instanceof Date ? va.getTime() : va;
      const bb = vb instanceof Date ? vb.getTime() : vb;
      if (aa == null && bb == null) return 0;
      if (aa == null) return 1;
      if (bb == null) return -1;
      if (aa < bb) return dir === "asc" ? -1 : 1;
      if (aa > bb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  };

  const paginate = (arr, page, pageSize) => {
    const start = (page - 1) * pageSize;
    return arr.slice(start, start + pageSize);
  };

  const toggleSort = (setter, current, key) => {
    if (current.key === key) {
      setter({ key, dir: current.dir === "asc" ? "desc" : "asc" });
    } else {
      setter({ key, dir: "asc" });
    }
  };

  // Number & chart helpers
  const formatNumber = (value) => {
    if (value == null || Number.isNaN(value)) return "-";
    const n = Number(value);
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toLocaleString("fa-IR");
  };

  const movingAverage = (arr, windowSize = 7) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const slice = arr.slice(start, i + 1);
      const avg = slice.reduce((sum, v) => sum + (Number(v) || 0), 0) / slice.length;
      res.push(Number(avg.toFixed(2)));
    }
    return res;
  };

  const computeDeltaPercent = (dailyStats, key) => {
    try {
      if (!dailyStats || dailyStats.length < 2) return null;
      const last = dailyStats[dailyStats.length - 1]?.[key];
      const prev = dailyStats[dailyStats.length - 2]?.[key];
      if (prev == null || last == null || Number(prev) === 0) return null;
      const delta = ((Number(last) - Number(prev)) / Number(prev)) * 100;
      return Number(delta.toFixed(1));
    } catch {
      return null;
    }
  };

  const DeltaBadge = ({ value }) => {
    if (value == null) return null;
    const positive = value >= 0;
    const color = positive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10";
    const arrow = positive ? "▲" : "▼";
    return (
      <span className={`ml-2 inline-flex items-center px-2 py-0.5 text-xs rounded ${color}`}>
        {arrow} {Math.abs(value).toLocaleString("fa-IR")}%
      </span>
    );
  };

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">دسترسی غیرمجاز</h1>
          <p>شما دسترسی ادمین ندارید.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-secondary mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const chartData = dashboardData?.daily_stats
    ? (() => {
        const stats = [...dashboardData.daily_stats].reverse();
        const end = stats.length;
        const start = Math.max(0, end - chartRange);
        const windowStats = stats.slice(start, end);

        const labels = windowStats.map((s) => s.date);
        const usersSeries = windowStats.map((s) => s.users);
        const auctionsSeries = windowStats.map((s) => s.auctions);
        const bidsSeries = windowStats.map((s) => s.bids);

        const datasets = [
          {
            label: "کاربران جدید",
            data: usersSeries,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.3)",
            tension: 0.3,
          },
          {
            label: "مزایده‌های جدید",
            data: auctionsSeries,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.3)",
            tension: 0.3,
          },
          {
            label: "پیشنهادات جدید",
            data: bidsSeries,
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.3)",
            tension: 0.3,
          },
        ];

        if (showMA) {
          datasets.push({
            label: "میانگین متحرک کاربران (۷روزه)",
            data: movingAverage(usersSeries, 7),
            borderColor: "rgba(255, 255, 255, 0.8)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderDash: [6, 4],
            pointRadius: 0,
            tension: 0.2,
          });
        }

        return { labels, datasets };
      })()
    : null;

  const statsData = dashboardData
    ? {
        labels: ["کاربران", "مزایده‌ها", "پیشنهادات", "اعلان‌ها"],
        datasets: [
          {
            label: "تعداد",
            data: [
              dashboardData.users.total,
              dashboardData.auctions.total,
              dashboardData.bids.total,
              dashboardData.notifications.total,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 205, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)",
            ],
          },
        ],
      }
    : null;

  // Trend deltas for overview badges
  const deltaUsers = computeDeltaPercent(dashboardData?.daily_stats, "users");
  const deltaAuctions = computeDeltaPercent(dashboardData?.daily_stats, "auctions");
  const deltaBids = computeDeltaPercent(dashboardData?.daily_stats, "bids");

  const gridColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed?.y ?? context.raw;
            return `${label}: ${formatNumber(value)}`;
          },
        },
      },
    },
    scales: {
      x: { grid: { color: gridColor } },
      y: { grid: { color: gridColor }, beginAtZero: true },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: { x: { stacked: false }, y: { beginAtZero: true } },
  };

  // Derived, sorted & paginated
  const sortedUsers = sortBy(users, userSort);
  const usersTotalPages = Math.max(
    1,
    Math.ceil(sortedUsers.length / userPageSize)
  );
  const pagedUsers = paginate(sortedUsers, userPage, userPageSize);

  const sortedAuctions = sortBy(auctions, auctionSort);
  const auctionsTotalPages = Math.max(
    1,
    Math.ceil(sortedAuctions.length / auctionPageSize)
  );
  const pagedAuctions = paginate(sortedAuctions, auctionPage, auctionPageSize);

  return (
    <div className="min-h-screen bg-[#32317D] text-white rounded-2xl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">داشبورد ادمین</h1>
          <p className="text-theme-secondary/70">مدیریت کامل سیستم</p>
          {lastUpdated && (
            <p className="text-xs text-theme-secondary/60 mt-1">
              آخرین بروزرسانی: {lastUpdated.toLocaleString("fa-IR")}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={loadDashboardData}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
              بروزرسانی داشبورد
            </button>
            <button
              onClick={() => {
                loadUsers();
                loadAuctions();
                toast.success("بروزرسانی لیست‌ها");
              }}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white"
            >
              بروزرسانی کاربران و مزایده‌ها
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-theme-secondary/20">
            {[
              { id: "overview", label: "نمای کلی" },
              { id: "users", label: "کاربران" },
              { id: "auctions", label: "مزایده‌ها" },
              { id: "bids", label: "پیشنهادات" },
              { id: "notifications", label: "اعلان‌ها" },
              { id: "currencies", label: "ارزها" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-t-lg transition-colors cursor-pointer hover:bg-[#483AA0] ${
                  activeTab === tab.id
                    ? "bg-theme-secondary text-theme-primary"
                    : "bg-theme-primary text-theme-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && dashboardData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-2">کاربران</h3>
                <div className="flex items-center gap-2 text-3xl font-bold text-blue-500">
                  {formatNumber(dashboardData.users.total)}
                  <DeltaBadge value={deltaUsers} />
                </div>
                <p className="text-sm text-theme-secondary/70">
                  {formatNumber(dashboardData.users.active)} فعال،{" "}
                  {formatNumber(dashboardData.users.premium)} پریمیوم
                </p>
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-2">مزایده‌ها</h3>
                <div className="flex items-center gap-2 text-3xl font-bold text-green-500">
                  {formatNumber(dashboardData.auctions.total)}
                  <DeltaBadge value={deltaAuctions} />
                </div>
                <p className="text-sm text-theme-secondary/70">
                  {formatNumber(dashboardData.auctions.active)} فعال،{" "}
                  {formatNumber(dashboardData.auctions.completed)} تکمیل شده
                </p>
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-2">پیشنهادات</h3>
                <div className="flex items-center gap-2 text-3xl font-bold text-yellow-500">
                  {formatNumber(dashboardData.bids.total)}
                  <DeltaBadge value={deltaBids} />
                </div>
                <p className="text-sm text-theme-secondary/70">
                  مجموع: {formatNumber(dashboardData.bids.total_amount)} تومان
                </p>
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-2">اعلان‌ها</h3>
                <div className="text-3xl font-bold text-purple-500">
                  {dashboardData.notifications.total}
                </div>
                <p className="text-sm text-theme-secondary/70">
                  {dashboardData.notifications.unread} نخوانده
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">آمار روزانه</h3>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "۷روز", value: 7 },
                      { label: "۳۰روز", value: 30 },
                      { label: "۹۰روز", value: 90 },
                    ].map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setChartRange(r.value)}
                        className={`px-2 py-1 text-xs rounded border ${
                          chartRange === r.value
                            ? "bg-blue-600 border-blue-500"
                            : "bg-[#0f1a3d] border-theme-secondary/30"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                    <label className="flex items-center gap-1 text-xs ml-2">
                      <input
                        type="checkbox"
                        checked={showMA}
                        onChange={(e) => setShowMA(e.target.checked)}
                      />
                      میانگین متحرک
                    </label>
                  </div>
                </div>
                {chartData && (
                  <div className="h-64">
                    <Line data={chartData} options={lineOptions} />
                  </div>
                )}
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-4">آمار کلی</h3>
                {statsData && (
                  <div className="h-64">
                    <Bar data={statsData} options={barOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-4">اقدامات سریع</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={loadUsers}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                  >
                    بروزرسانی کاربران
                  </button>
                  <button
                    onClick={loadAuctions}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
                  >
                    بروزرسانی مزایده‌ها
                  </button>
                  <button
                    onClick={() =>
                      toast("برای تاییدها از تب مزایده‌ها استفاده کنید")
                    }
                    className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                  >
                    درخواست‌های تایید
                  </button>
                  <button
                    onClick={() => handleExportData("users")}
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg"
                  >
                    صادرات کاربران
                  </button>
                </div>
              </div>
              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-4">
                  مزایده‌های در انتظار بررسی
                </h3>
                <ul className="space-y-2">
                  {sortedAuctions
                    .filter((a) => a.status === "pending_review")
                    .slice(0, 5)
                    .map((a) => (
                      <li key={a.id} className="flex justify-between text-sm">
                        <span>{a.title}</span>
                        <span className="text-yellow-400">در انتظار تایید</span>
                      </li>
                    ))}
                  {sortedAuctions.filter((a) => a.status === "pending_review")
                    .length === 0 && (
                    <li className="text-sm text-theme-secondary/70">
                      موردی وجود ندارد
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در کاربران..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                />
                <button
                  onClick={loadUsers}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  جستجو
                </button>
                <button
                  onClick={() => {
                    setUserPage(1);
                    loadUsers();
                  }}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  بروزرسانی
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("activate", "user")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  فعال کردن انتخاب شده
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate", "user")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  غیرفعال کردن انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("users")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
              </div>
            </div>

            <div className="bg-theme-secondary/10 rounded-lg border border-theme-secondary/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-theme-secondary/20">
                  <tr>
                    <th className="px-4 py-3 text-right">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length === users.length &&
                          users.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setUserSort, userSort, "username")
                      }
                    >
                      نام کاربری{" "}
                      {userSort.key === "username"
                        ? userSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() => toggleSort(setUserSort, userSort, "email")}
                    >
                      ایمیل{" "}
                      {userSort.key === "email"
                        ? userSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">شرکت</th>
                    <th className="px-4 py-3 text-right">اشتراک</th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setUserSort, userSort, "created_at")
                      }
                    >
                      وضعیت/تاریخ{" "}
                      {userSort.key === "created_at"
                        ? userSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-theme-secondary/20"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(user.id)}
                          onChange={() => handleItemSelect(user.id)}
                        />
                      </td>
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.company || "-"}</td>
                      <td className="px-4 py-3">{user.subscription_type}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.is_active
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {user.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                          ویرایش
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">اندازه صفحه:</span>
                  <select
                    value={userPageSize}
                    onChange={(e) => {
                      setUserPageSize(Number(e.target.value));
                      setUserPage(1);
                    }}
                    className="bg-[#192658] border border-theme-secondary/20 rounded px-2 py-1"
                  >
                    {[5, 10, 20, 50].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="text-sm">
                    صفحه {userPage} از {usersTotalPages}
                  </span>
                  <button
                    disabled={userPage >= usersTotalPages}
                    onClick={() =>
                      setUserPage((p) => Math.min(usersTotalPages, p + 1))
                    }
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "auctions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در مزایده‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                />
                <button
                  onClick={loadAuctions}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  جستجو
                </button>
                <button
                  onClick={() => {
                    setAuctionPage(1);
                    loadAuctions();
                  }}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  بروزرسانی
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("activate", "auction")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  فعال کردن انتخاب شده
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate", "auction")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  غیرفعال کردن انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("auctions")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
              </div>
            </div>

            <div className="bg-theme-secondary/10 rounded-lg border border-theme-secondary/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-theme-secondary/20">
                  <tr>
                    <th className="px-4 py-3 text-right">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length === auctions.length &&
                          auctions.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setAuctionSort, auctionSort, "title")
                      }
                    >
                      عنوان{" "}
                      {auctionSort.key === "title"
                        ? auctionSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">ایجادکننده</th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setAuctionSort, auctionSort, "current_price")
                      }
                    >
                      قیمت فعلی{" "}
                      {auctionSort.key === "current_price"
                        ? auctionSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">وضعیت</th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setAuctionSort, auctionSort, "created_at")
                      }
                    >
                      تاریخ ایجاد{" "}
                      {auctionSort.key === "created_at"
                        ? auctionSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAuctions.map((auction) => (
                    <tr
                      key={auction.id}
                      className="border-t border-theme-secondary/20"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(auction.id)}
                          onChange={() => handleItemSelect(auction.id)}
                        />
                      </td>
                      <td className="px-4 py-3">{auction.title}</td>
                      <td className="px-4 py-3">
                        {auction.creator?.username || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {auction.current_price?.toLocaleString()} تومان
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            auction.status === "active"
                              ? "bg-green-500 text-white"
                              : auction.status === "completed"
                              ? "bg-blue-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {auction.status === "active"
                            ? "فعال"
                            : auction.status === "completed"
                            ? "تکمیل شده"
                            : "غیرفعال"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(auction.created_at).toLocaleDateString(
                          "fa-IR"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                          ویرایش
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">اندازه صفحه:</span>
                  <select
                    value={auctionPageSize}
                    onChange={(e) => {
                      setAuctionPageSize(Number(e.target.value));
                      setAuctionPage(1);
                    }}
                    className="bg-[#192658] border border-theme-secondary/20 rounded px-2 py-1"
                  >
                    {[5, 10, 20, 50].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={auctionPage <= 1}
                    onClick={() => setAuctionPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="text-sm">
                    صفحه {auctionPage} از {auctionsTotalPages}
                  </span>
                  <button
                    disabled={auctionPage >= auctionsTotalPages}
                    onClick={() =>
                      setAuctionPage((p) => Math.min(auctionsTotalPages, p + 1))
                    }
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
