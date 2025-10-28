import React, { useState, useEffect } from "react";
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
      alert("لطفاً مواردی را انتخاب کنید");
      return;
    }

    try {
      await adminBulkAction(action, modelType, selectedItems);
      setSelectedItems([]);
      switch (activeTab) {
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
      }

      alert("عملیات با موفقیت انجام شد");
    } catch (error) {
      console.error("خطا در انجام عملیات گروهی:", error);
      alert("خطا در انجام عملیات");
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
    } catch (error) {
      console.error("خطا در صادرات داده:", error);
      alert("خطا در صادرات داده");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItems([]);
    setSearchTerm("");

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
    ? {
        labels: dashboardData.daily_stats.map((stat) => stat.date).reverse(),
        datasets: [
          {
            label: "کاربران جدید",
            data: dashboardData.daily_stats.map((stat) => stat.users).reverse(),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "مزایده‌های جدید",
            data: dashboardData.daily_stats
              .map((stat) => stat.auctions)
              .reverse(),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "پیشنهادات جدید",
            data: dashboardData.daily_stats.map((stat) => stat.bids).reverse(),
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
        ],
      }
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

  return (
    <div className="min-h-screen bg-[#32317D] text-white rounded-2xl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">داشبورد ادمین</h1>
          <p className="text-theme-secondary/70">مدیریت کامل سیستم</p>
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
                <div className="text-3xl font-bold text-blue-500">
                  {dashboardData.users.total}
                </div>
                <p className="text-sm text-theme-secondary/70">
                  {dashboardData.users.active} فعال،{" "}
                  {dashboardData.users.premium} پریمیوم
                </p>
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-2">مزایده‌ها</h3>
                <div className="text-3xl font-bold text-green-500">
                  {dashboardData.auctions.total}
                </div>
                <p className="text-sm text-theme-secondary/70">
                  {dashboardData.auctions.active} فعال،{" "}
                  {dashboardData.auctions.completed} تکمیل شده
                </p>
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-2">پیشنهادات</h3>
                <div className="text-3xl font-bold text-yellow-500">
                  {dashboardData.bids.total}
                </div>
                <p className="text-sm text-theme-secondary/70">
                  مجموع: {dashboardData.bids.total_amount.toLocaleString()}{" "}
                  تومان
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
                <h3 className="text-lg font-semibold mb-4">آمار روزانه</h3>
                {chartData && <Line data={chartData} />}
              </div>

              <div className="bg-[#192658] p-6 rounded-lg border border-theme-secondary/20">
                <h3 className="text-lg font-semibold mb-4">آمار کلی</h3>
                {statsData && <Bar data={statsData} />}
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
                    <th className="px-4 py-3 text-right">نام کاربری</th>
                    <th className="px-4 py-3 text-right">ایمیل</th>
                    <th className="px-4 py-3 text-right">شرکت</th>
                    <th className="px-4 py-3 text-right">اشتراک</th>
                    <th className="px-4 py-3 text-right">وضعیت</th>
                    <th className="px-4 py-3 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
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
                    <th className="px-4 py-3 text-right">عنوان</th>
                    <th className="px-4 py-3 text-right">ایجادکننده</th>
                    <th className="px-4 py-3 text-right">قیمت فعلی</th>
                    <th className="px-4 py-3 text-right">وضعیت</th>
                    <th className="px-4 py-3 text-right">تاریخ ایجاد</th>
                    <th className="px-4 py-3 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
