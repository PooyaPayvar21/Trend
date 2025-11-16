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
  const [tenders, setTenders] = useState([]);
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
  // Tender sorting and pagination
  const [tenderSort, setTenderSort] = useState({
    key: "created_at",
    dir: "desc",
  });
  const [tenderPage, setTenderPage] = useState(1);
  const [tenderPageSize, setTenderPageSize] = useState(10);
  // Bids sorting and pagination
  const [bidSort, setBidSort] = useState({ key: "created_at", dir: "desc" });
  const [bidPage, setBidPage] = useState(1);
  const [bidPageSize, setBidPageSize] = useState(10);
  // Currencies sorting and pagination
  const [currencySort, setCurrencySort] = useState({ key: "code", dir: "asc" });
  const [currencyPage, setCurrencyPage] = useState(1);
  const [currencyPageSize, setCurrencyPageSize] = useState(10);
  // Filters
  const [userActiveFilter, setUserActiveFilter] = useState("all"); // all | active | inactive
  const [userSubFilter, setUserSubFilter] = useState("all"); // all | premium | basic
  const [auctionStatusFilter, setAuctionStatusFilter] = useState("all");
  const [tenderStatusFilter, setTenderStatusFilter] = useState("all");
  // Notifications filters & pagination
  const [notificationReadFilter, setNotificationReadFilter] = useState("all"); // all | read | unread
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationPageSize, setNotificationPageSize] = useState(10);
  // Per-tab loading indicators
  const [listLoading, setListLoading] = useState({
    users: false,
    auctions: false,
    tender: false,
    bids: false,
    notifications: false,
    currencies: false,
  });
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
    setListLoading((prev) => ({ ...prev, users: true }));
    try {
      const data = await getAdminUsers({ search: searchTerm });
      setUsers(data);
    } catch (error) {
      console.error("خطا در بارگذاری کاربران:", error);
    } finally {
      setListLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const loadAuctions = async () => {
    setListLoading((prev) => ({ ...prev, auctions: true }));
    try {
      const data = await getAdminAuctions({ search: searchTerm });
      setAuctions(data);
    } catch (error) {
      console.error("خطا در بارگذاری مزایده‌ها:", error);
    } finally {
      setListLoading((prev) => ({ ...prev, auctions: false }));
    }
  };

  const loadTenders = async () => {
    setListLoading((prev) => ({ ...prev, tender: true }));
    try {
      // Reuse getAdminAuctions but request tenders (API should support type filter)
      const data = await getAdminAuctions({
        search: searchTerm,
        type: "tender",
      });
      setTenders(data);
    } catch (error) {
      console.error("خطا در بارگذاری مناقصه‌ها:", error);
    } finally {
      setListLoading((prev) => ({ ...prev, tender: false }));
    }
  };

  const loadBids = async () => {
    setListLoading((prev) => ({ ...prev, bids: true }));
    try {
      const data = await getAdminBids({ search: searchTerm });
      setBids(data);
    } catch (error) {
      console.error("خطا در بارگذاری پیشنهادات:", error);
    } finally {
      setListLoading((prev) => ({ ...prev, bids: false }));
    }
  };

  const loadNotifications = async () => {
    setListLoading((prev) => ({ ...prev, notifications: true }));
    try {
      const data = await getAdminNotifications({ search: searchTerm });
      setNotifications(data);
    } catch (error) {
      console.error("خطا در بارگذاری اعلان‌ها:", error);
    } finally {
      setListLoading((prev) => ({ ...prev, notifications: false }));
    }
  };

  const loadCurrencies = async () => {
    setListLoading((prev) => ({ ...prev, currencies: true }));
    try {
      const data = await getAdminCurrencies({ search: searchTerm });
      setCurrencies(data);
    } catch (error) {
      console.error("خطا در بارگذاری ارزها:", error);
    } finally {
      setListLoading((prev) => ({ ...prev, currencies: false }));
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
      case "tender":
        loadTenders();
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
      case "tender":
        currentItems = tenders.map((tender) => tender.id);
        break;
    }

    setSelectedItems(
      selectedItems.length === currentItems.length ? [] : currentItems
    );
  };

  // Additional selection helpers
  const handleSelectPage = () => {
    let pageIds = [];
    switch (activeTab) {
      case "users":
        pageIds = pagedUsers.map((u) => u.id);
        break;
      case "auctions":
        pageIds = pagedAuctions.map((a) => a.id);
        break;
      case "tender":
        pageIds = pagedTenders.map((t) => t.id);
        break;
      case "bids":
        pageIds = pagedBids.map((b) => b.id);
        break;
      case "notifications":
        pageIds = (pagedNotifications || notifications).map((n) => n.id);
        break;
      default:
        pageIds = [];
    }
    setSelectedItems(pageIds);
  };

  const invertSelection = () => {
    let allIds = [];
    switch (activeTab) {
      case "users":
        allIds = users.map((u) => u.id);
        break;
      case "auctions":
        allIds = auctions.map((a) => a.id);
        break;
      case "tender":
        allIds = tenders.map((t) => t.id);
        break;
      case "bids":
        allIds = bids.map((b) => b.id);
        break;
      case "notifications":
        allIds = notifications.map((n) => n.id);
        break;
      case "currencies":
        allIds = currencies.map((c) => c.id);
        break;
      default:
        allIds = [];
    }
    const inverted = allIds.filter((id) => !selectedItems.includes(id));
    setSelectedItems(inverted);
  };

  // Row-level single action helper
  const handleSingleAction = async (action, modelType, id) => {
    try {
      await adminBulkAction(action, modelType, [id]);
      switch (modelType) {
        case "user":
          await loadUsers();
          break;
        case "auction":
          await loadAuctions();
          break;
        case "tender":
          await loadTenders();
          break;
        case "bid":
          await loadBids();
          break;
        case "notification":
          await loadNotifications();
          break;
      }
      toast.success("عملیات انجام شد");
    } catch (e) {
      console.error(e);
      toast.error("خطا در انجام عملیات");
    }
  };

  const exportCurrentView = (filename, rows) => {
    try {
      const blob = new Blob([JSON.stringify(rows, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("صادرات نمای فعلی انجام شد");
    } catch (error) {
      console.error("خطا در صادرات نمای فعلی:", error);
      toast.error("خطا در صادرات نمای فعلی");
    }
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
      const avg =
        slice.reduce((sum, v) => sum + (Number(v) || 0), 0) / slice.length;
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
    const color = positive
      ? "text-green-400 bg-green-400/10"
      : "text-red-400 bg-red-400/10";
    const arrow = positive ? "▲" : "▼";
    return (
      <span
        className={`ml-2 inline-flex items-center px-2 py-0.5 text-xs rounded ${color}`}
      >
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
  const deltaAuctions = computeDeltaPercent(
    dashboardData?.daily_stats,
    "auctions"
  );
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
  const filteredUsers = sortedUsers.filter((u) => {
    const byActive =
      userActiveFilter === "all" ||
      (userActiveFilter === "active" && u.is_active) ||
      (userActiveFilter === "inactive" && !u.is_active);
    const bySub =
      userSubFilter === "all" ||
      (userSubFilter === "premium" &&
        (u.subscription_type?.toLowerCase() === "premium" || u.is_premium)) ||
      (userSubFilter === "basic" &&
        !(u.subscription_type?.toLowerCase() === "premium" || u.is_premium));
    return byActive && bySub;
  });
  const usersTotalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / userPageSize)
  );
  const pagedUsers = paginate(filteredUsers, userPage, userPageSize);

  const sortedAuctions = sortBy(auctions, auctionSort);
  const filteredAuctions = sortedAuctions.filter((a) => {
    return (
      auctionStatusFilter === "all" ||
      auctionStatusFilter === (a.status || "").toLowerCase()
    );
  });
  const auctionsTotalPages = Math.max(
    1,
    Math.ceil(filteredAuctions.length / auctionPageSize)
  );
  const pagedAuctions = paginate(
    filteredAuctions,
    auctionPage,
    auctionPageSize
  );

  // Tenders derived, sorted & paginated
  const sortedTenders = sortBy(tenders, tenderSort);
  const filteredTenders = sortedTenders.filter((t) => {
    return (
      tenderStatusFilter === "all" ||
      tenderStatusFilter === (t.status || "").toLowerCase()
    );
  });
  const tendersTotalPages = Math.max(
    1,
    Math.ceil(filteredTenders.length / tenderPageSize)
  );
  const pagedTenders = paginate(filteredTenders, tenderPage, tenderPageSize);

  // Bids derived, sorted & paginated
  const sortedBids = sortBy(bids, bidSort);
  const bidsTotalPages = Math.max(
    1,
    Math.ceil(sortedBids.length / bidPageSize)
  );
  const pagedBids = paginate(sortedBids, bidPage, bidPageSize);

  // Currencies derived, sorted & paginated
  const sortedCurrencies = sortBy(currencies, currencySort);
  const currenciesTotalPages = Math.max(
    1,
    Math.ceil(sortedCurrencies.length / currencyPageSize)
  );
  const pagedCurrencies = paginate(
    sortedCurrencies,
    currencyPage,
    currencyPageSize
  );

  // Notifications derived, filtered & paginated
  const filteredNotifications = notifications.filter((n) => {
    return (
      notificationReadFilter === "all" ||
      (notificationReadFilter === "read" && n.read) ||
      (notificationReadFilter === "unread" && !n.read)
    );
  });
  const notificationsTotalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / notificationPageSize)
  );
  const pagedNotifications = paginate(
    filteredNotifications,
    notificationPage,
    notificationPageSize
  );

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
              { id: "tender", label: "مناقصه ها" },
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
              <div
                className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20 cursor-pointer hover:bg-[#1b2b61]"
                onClick={() => setActiveTab("users")}
              >
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

              <div
                className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20 cursor-pointer hover:bg-[#1b2b61]"
                onClick={() => setActiveTab("auctions")}
              >
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

              <div
                className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20 cursor-pointer hover:bg-[#1b2b61]"
                onClick={() => setActiveTab("bids")}
              >
                <h3 className="text-lg font-semibold mb-2">پیشنهادات</h3>
                <div className="flex items-center gap-2 text-3xl font-bold text-yellow-500">
                  {formatNumber(dashboardData.bids.total)}
                  <DeltaBadge value={deltaBids} />
                </div>
                <p className="text-sm text-theme-secondary/70">
                  مجموع: {formatNumber(dashboardData.bids.total_amount)} تومان
                </p>
              </div>

              <div
                className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20 cursor-pointer hover:bg-[#1b2b61]"
                onClick={() => setActiveTab("notifications")}
              >
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
                  disabled={listLoading.users}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {listLoading.users ? "در حال بروزرسانی..." : "بروزرسانی"}
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setUserActiveFilter("all");
                    setUserSubFilter("all");
                    setUserPage(1);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  پاک‌سازی فیلترها
                </button>
                <select
                  value={userActiveFilter}
                  onChange={(e) => {
                    setUserActiveFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="px-2 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                  title="فیلتر وضعیت"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
                <select
                  value={userSubFilter}
                  onChange={(e) => {
                    setUserSubFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="px-2 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                  title="فیلتر اشتراک"
                >
                  <option value="all">همه اشتراک‌ها</option>
                  <option value="premium">پریمیوم</option>
                  <option value="basic">عادی</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs text-theme-secondary/70">
                  انتخاب شده: {selectedItems.length}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  لغو انتخاب
                </button>
                <button
                  onClick={handleSelectPage}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب صفحه
                </button>
                <button
                  onClick={invertSelection}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  وارونه‌سازی انتخاب
                </button>
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
                  onClick={() => handleBulkAction("make_premium", "user")}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  اعطای پریمیوم
                </button>
                <button
                  onClick={() => handleBulkAction("delete", "user")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("users")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
                <button
                  onClick={() => exportCurrentView("users_view", pagedUsers)}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  صادرات نمای فعلی
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
                        <button
                          onClick={() =>
                            handleSingleAction(
                              user.is_active ? "deactivate" : "activate",
                              "user",
                              user.id
                            )
                          }
                          className="ml-2 px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
                        >
                          {user.is_active ? "غیرفعال" : "فعال"}
                        </button>
                        <button
                          onClick={() =>
                            handleSingleAction("make_premium", "user", user.id)
                          }
                          className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                        >
                          پریمیوم
                        </button>
                        <button
                          onClick={() =>
                            handleSingleAction("delete", "user", user.id)
                          }
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          حذف
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
                  disabled={listLoading.auctions}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {listLoading.auctions ? "در حال بروزرسانی..." : "بروزرسانی"}
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setAuctionStatusFilter("all");
                    setAuctionPage(1);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  پاک‌سازی فیلترها
                </button>
                <select
                  value={auctionStatusFilter}
                  onChange={(e) => {
                    setAuctionStatusFilter(e.target.value);
                    setAuctionPage(1);
                  }}
                  className="px-2 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                  title="فیلتر وضعیت"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="pending_review">در انتظار بررسی</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs text-theme-secondary/70">
                  انتخاب شده: {selectedItems.length}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  لغو انتخاب
                </button>
                <button
                  onClick={handleSelectPage}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب صفحه
                </button>
                <button
                  onClick={invertSelection}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  وارونه‌سازی انتخاب
                </button>
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
                  onClick={() => handleBulkAction("delete", "auction")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("auctions")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
                <button
                  onClick={() =>
                    exportCurrentView("auctions_view", pagedAuctions)
                  }
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  صادرات نمای فعلی
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
                        <button
                          onClick={() =>
                            handleSingleAction(
                              auction.status === "active"
                                ? "deactivate"
                                : "activate",
                              "auction",
                              auction.id
                            )
                          }
                          className="ml-2 px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
                        >
                          {auction.status === "active" ? "غیرفعال" : "فعال"}
                        </button>
                        <button
                          onClick={() =>
                            handleSingleAction("delete", "auction", auction.id)
                          }
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          حذف
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

        {activeTab === "tender" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در مناقصه‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                />
                <button
                  onClick={loadTenders}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  جستجو
                </button>
                <button
                  onClick={() => {
                    loadTenders();
                  }}
                  disabled={listLoading.tender}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {listLoading.tender ? "در حال بروزرسانی..." : "بروزرسانی"}
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setTenderStatusFilter("all");
                    setTenderPage(1);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  پاک‌سازی فیلترها
                </button>
                <select
                  value={tenderStatusFilter}
                  onChange={(e) => {
                    setTenderStatusFilter(e.target.value);
                    setTenderPage(1);
                  }}
                  className="px-2 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                  title="فیلتر وضعیت"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="pending_review">در انتظار بررسی</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs text-theme-secondary/70">
                  انتخاب شده: {selectedItems.length}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  لغو انتخاب
                </button>
                <button
                  onClick={handleSelectPage}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب صفحه
                </button>
                <button
                  onClick={invertSelection}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  وارونه‌سازی انتخاب
                </button>
                <button
                  onClick={() => handleBulkAction("activate", "tender")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  فعال کردن انتخاب شده
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate", "tender")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  غیرفعال کردن انتخاب شده
                </button>
                <button
                  onClick={() => handleBulkAction("delete", "tender")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("tenders")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
                <button
                  onClick={() =>
                    exportCurrentView("tenders_view", pagedTenders)
                  }
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  صادرات نمای فعلی
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
                          selectedItems.length === filteredTenders.length &&
                          filteredTenders.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setTenderSort, tenderSort, "title")
                      }
                    >
                      عنوان{" "}
                      {tenderSort.key === "title"
                        ? tenderSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">ایجادکننده</th>
                    <th className="px-4 py-3 text-right">وضعیت</th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setTenderSort, tenderSort, "created_at")
                      }
                    >
                      تاریخ ایجاد{" "}
                      {tenderSort.key === "created_at"
                        ? tenderSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTenders.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-theme-secondary/20"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(t.id)}
                          onChange={() => handleItemSelect(t.id)}
                        />
                      </td>
                      <td className="px-4 py-3">{t.title}</td>
                      <td className="px-4 py-3">
                        {t.creator?.username || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            t.status === "active"
                              ? "bg-green-500 text-white"
                              : t.status === "completed"
                              ? "bg-blue-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {t.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {t.created_at
                          ? new Date(t.created_at).toLocaleDateString("fa-IR")
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                          ویرایش
                        </button>
                        <button
                          onClick={() =>
                            handleSingleAction(
                              t.status === "active" ? "deactivate" : "activate",
                              "tender",
                              t.id
                            )
                          }
                          className="ml-2 px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
                        >
                          {t.status === "active" ? "غیرفعال" : "فعال"}
                        </button>
                        <button
                          onClick={() =>
                            handleSingleAction("delete", "tender", t.id)
                          }
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          حذف
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
                    value={tenderPageSize}
                    onChange={(e) => {
                      setTenderPageSize(Number(e.target.value));
                      setTenderPage(1);
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
                    disabled={tenderPage <= 1}
                    onClick={() => setTenderPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="text-sm">
                    صفحه {tenderPage} از {tendersTotalPages}
                  </span>
                  <button
                    disabled={tenderPage >= tendersTotalPages}
                    onClick={() =>
                      setTenderPage((p) => Math.min(tendersTotalPages, p + 1))
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

        {activeTab === "bids" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در پیشنهادات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                />
                <button
                  onClick={loadBids}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  جستجو
                </button>
                <button
                  onClick={loadBids}
                  disabled={listLoading.bids}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {listLoading.bids ? "در حال بروزرسانی..." : "بروزرسانی"}
                </button>
                <select
                  value={bidPageSize}
                  onChange={(e) => {
                    setBidPageSize(Number(e.target.value));
                    setBidPage(1);
                  }}
                  className="px-2 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                  title="اندازه صفحه"
                >
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs text-theme-secondary/70">
                  انتخاب شده: {selectedItems.length}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  لغو انتخاب
                </button>
                <button
                  onClick={handleSelectPage}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب صفحه
                </button>
                <button
                  onClick={invertSelection}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  وارونه‌سازی انتخاب
                </button>
                <button
                  onClick={() => handleBulkAction("refund", "bid")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  بازگشت انتخاب شده
                </button>
                <button
                  onClick={() => handleBulkAction("delete", "bid")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("bids")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
                <button
                  onClick={() => exportCurrentView("bids_view", pagedBids)}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  صادرات نمای فعلی
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
                          selectedItems.length === sortedBids.length &&
                          sortedBids.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-right">شناسه</th>
                    <th className="px-4 py-3 text-right">مزایده</th>
                    <th className="px-4 py-3 text-right">کاربر</th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() => toggleSort(setBidSort, bidSort, "amount")}
                    >
                      مبلغ{" "}
                      {bidSort.key === "amount"
                        ? bidSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setBidSort, bidSort, "created_at")
                      }
                    >
                      تاریخ{" "}
                      {bidSort.key === "created_at"
                        ? bidSort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedBids.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t border-theme-secondary/20"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(b.id)}
                          onChange={() => handleItemSelect(b.id)}
                        />
                      </td>
                      <td className="px-4 py-3">{b.id}</td>
                      <td className="px-4 py-3">{b.auction?.title || "-"}</td>
                      <td className="px-4 py-3">{b.user?.username || "-"}</td>
                      <td className="px-4 py-3">
                        {b.amount?.toLocaleString() || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {b.created_at
                          ? new Date(b.created_at).toLocaleString("fa-IR")
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleSingleAction("refund", "bid", b.id)
                          }
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          بازگشت
                        </button>
                        <button
                          onClick={() =>
                            handleSingleAction("delete", "bid", b.id)
                          }
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          حذف
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
                    value={bidPageSize}
                    onChange={(e) => {
                      setBidPageSize(Number(e.target.value));
                      setBidPage(1);
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
                    disabled={bidPage <= 1}
                    onClick={() => setBidPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="text-sm">
                    صفحه {bidPage} از {bidsTotalPages}
                  </span>
                  <button
                    disabled={bidPage >= bidsTotalPages}
                    onClick={() =>
                      setBidPage((p) => Math.min(bidsTotalPages, p + 1))
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

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در اعلان‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                />
                <button
                  onClick={loadNotifications}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  جستجو
                </button>
                <button
                  onClick={loadNotifications}
                  disabled={listLoading.notifications}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {listLoading.notifications
                    ? "در حال بروزرسانی..."
                    : "بروزرسانی"}
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-theme-secondary/70">
                  انتخاب شده: {selectedItems.length}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب همه
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  لغو انتخاب
                </button>
                <button
                  onClick={handleSelectPage}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  انتخاب صفحه
                </button>
                <button
                  onClick={invertSelection}
                  className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                >
                  وارونه‌سازی انتخاب
                </button>
                <button
                  onClick={() => handleBulkAction("mark_read", "notification")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  علامت‌گذاری خوانده شده
                </button>
                <button
                  onClick={() => handleBulkAction("delete", "notification")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف انتخاب شده
                </button>
                <button
                  onClick={() => handleExportData("notifications")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  صادرات
                </button>
                <button
                  onClick={() =>
                    exportCurrentView(
                      "notifications_view",
                      typeof pagedNotifications !== "undefined" &&
                        pagedNotifications
                        ? pagedNotifications
                        : notifications
                    )
                  }
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                >
                  صادرات نمای فعلی
                </button>
              </div>
            </div>

            <div className="bg-theme-secondary/10 rounded-lg border border-theme-secondary/20 overflow-hidden">
              <ul className="p-4 space-y-3">
                {notifications.length === 0 && (
                  <li className="text-sm text-theme-secondary/70">
                    موردی وجود ندارد
                  </li>
                )}
                {notifications.map((n) => (
                  <li key={n.id} className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(n.id)}
                        onChange={() => handleItemSelect(n.id)}
                      />
                      <div>
                        <div className="font-medium">{n.title}</div>
                        <div className="text-sm text-theme-secondary/70">
                          {n.body}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-theme-secondary/60">
                        {n.read ? "خوانده شده" : "نخوانده"} •{" "}
                        {n.created_at
                          ? new Date(n.created_at).toLocaleString("fa-IR")
                          : "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        {!n.read && (
                          <button
                            onClick={() =>
                              handleSingleAction(
                                "mark_read",
                                "notification",
                                n.id
                              )
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            خواندن
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleSingleAction("delete", "notification", n.id)
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "currencies" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در ارزها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-theme-secondary/20 rounded-lg bg-theme-primary text-theme-secondary"
                />
                <button
                  onClick={loadCurrencies}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  جستجو
                </button>
                <button
                  onClick={loadCurrencies}
                  disabled={listLoading.currencies}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {listLoading.currencies ? "در حال بروزرسانی..." : "بروزرسانی"}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportData("currencies")}
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
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setCurrencySort, currencySort, "code")
                      }
                    >
                      نماد{" "}
                      {currencySort.key === "code"
                        ? currencySort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setCurrencySort, currencySort, "name")
                      }
                    >
                      نام{" "}
                      {currencySort.key === "name"
                        ? currencySort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() =>
                        toggleSort(setCurrencySort, currencySort, "price")
                      }
                    >
                      قیمت{" "}
                      {currencySort.key === "price"
                        ? currencySort.dir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                    <th className="px-4 py-3 text-right">تغییر</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCurrencies.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-theme-secondary/20"
                    >
                      <td className="px-4 py-3">{c.code}</td>
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3">
                        {c.price?.toLocaleString() || "-"}
                      </td>
                      <td className="px-4 py-3">{c.change || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">اندازه صفحه:</span>
                  <select
                    value={currencyPageSize}
                    onChange={(e) => {
                      setCurrencyPageSize(Number(e.target.value));
                      setCurrencyPage(1);
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
                    disabled={currencyPage <= 1}
                    onClick={() => setCurrencyPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-[#192658] border border-theme-secondary/20 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="text-sm">
                    صفحه {currencyPage} از {currenciesTotalPages}
                  </span>
                  <button
                    disabled={currencyPage >= currenciesTotalPages}
                    onClick={() =>
                      setCurrencyPage((p) =>
                        Math.min(currenciesTotalPages, p + 1)
                      )
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
