import React, { useEffect, useMemo, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  getAdminDashboard,
  getAdminAuctions,
  getAdminUsers,
  getAdminBids,
  getAdminNotifications,
  deleteAdminUser,
  deleteAdminAuction,
  deleteAdminBid,
  deleteAdminNotification,
  adminBulkAction,
} from "../api/admin";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function AdminDashboard2() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [timeframe, setTimeframe] = useState("30d");
  const [search, setSearch] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dash, usr, auc, bidList, notiList] = await Promise.all([
          getAdminDashboard(),
          getAdminUsers({ search }),
          getAdminAuctions({ search }),
          getAdminBids({ search }),
          getAdminNotifications({ search }),
        ]);
        setDashboardData(dash);
        setUsers(usr);
        setAuctions(auc);
        setBids(bidList);
        setNotifications(notiList);
      } catch (e) {
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  const rangeDays = useMemo(
    () => (timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90),
    [timeframe]
  );

  const chartData = useMemo(() => {
    if (!dashboardData?.daily_stats) return [];
    const stats = [...dashboardData.daily_stats];
    const end = stats.length;
    const start = Math.max(0, end - rangeDays);
    const windowStats = stats.slice(start, end);
    return windowStats.map((s, idx) => ({
      day: s.date || `D${idx + 1}`,
      users: s.users ?? 0,
      auctions: s.auctions ?? 0,
      bids: s.bids ?? 0,
    }));
  }, [dashboardData, rangeDays]);

  const sources = useMemo(() => {
    const a = dashboardData?.users?.total ?? 0;
    const b = dashboardData?.auctions?.total ?? 0;
    const c = dashboardData?.bids?.total ?? 0;
    const d = dashboardData?.notifications?.total ?? 0;
    const total = a + b + c + d || 1;
    return [
      { name: "Users", value: Math.round((a / total) * 100) },
      { name: "Auctions", value: Math.round((b / total) * 100) },
      { name: "Bids", value: Math.round((c / total) * 100) },
      { name: "Notifications", value: Math.round((d / total) * 100) },
    ];
  }, [dashboardData]);

  const totals = useMemo(() => {
    const usersTotal = dashboardData?.users?.total ?? 0;
    const auctionsTotal = dashboardData?.auctions?.total ?? 0;
    const bidsTotal = dashboardData?.bids?.total ?? 0;
    const notificationsTotal = dashboardData?.notifications?.total ?? 0;
    const newUsers = chartData.reduce((acc, d) => acc + (d.users ?? 0), 0);
    return {
      usersTotal,
      auctionsTotal,
      bidsTotal,
      notificationsTotal,
      newUsers,
    };
  }, [dashboardData, chartData]);

  const filteredAuctions = useMemo(() => {
    if (!search) return auctions;
    const q = search.toLowerCase();
    return auctions.filter(
      (a) =>
        String(a.id).toLowerCase().includes(q) ||
        (a.title || "").toLowerCase().includes(q) ||
        (a.creator?.username || "").toLowerCase().includes(q) ||
        (a.status || "").toLowerCase().includes(q)
    );
  }, [auctions, search]);

  const colors = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });

  const handleDeleteUser = async (id) => {
    try {
      await deleteAdminUser(id);
      toast.success("User deleted");
      const refreshed = await getAdminUsers({ search });
      setUsers(refreshed);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleToggleUserActive = async (id, isActive) => {
    try {
      await adminBulkAction(isActive ? "deactivate" : "activate", "user", [id]);
      toast.success(isActive ? "User deactivated" : "User activated");
      const refreshed = await getAdminUsers({ search });
      setUsers(refreshed);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleToggleAuction = async (auction) => {
    try {
      const action = auction.status === "active" ? "deactivate" : "activate";
      await adminBulkAction(action, "auction", [auction.id]);
      toast.success(
        action === "deactivate" ? "Auction deactivated" : "Auction activated"
      );
      const refreshed = await getAdminAuctions({ search });
      setAuctions(refreshed);
    } catch {
      toast.error("Failed to update auction");
    }
  };

  const handleDeleteAuction = async (id) => {
    try {
      await deleteAdminAuction(id);
      toast.success("Auction deleted");
      const refreshed = await getAdminAuctions({ search });
      setAuctions(refreshed);
    } catch {
      toast.error("Failed to delete auction");
    }
  };

  const handleDeleteBid = async (id) => {
    try {
      await deleteAdminBid(id);
      toast.success("Bid deleted");
      const refreshed = await getAdminBids({ search });
      setBids(refreshed);
    } catch {
      toast.error("Failed to delete bid");
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await adminBulkAction("mark_read", "notification", [id]);
      toast.success("Marked as read");
      const refreshed = await getAdminNotifications({ search });
      setNotifications(refreshed);
    } catch {
      toast.error("Failed to mark read");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteAdminNotification(id);
      toast.success("Notification deleted");
      const refreshed = await getAdminNotifications({ search });
      setNotifications(refreshed);
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in name and email");
      return;
    }
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: "", email: "", role: "Viewer" });
    setAddUserOpen(false);
    toast.success("User added");
  };

  if (user && user.is_admin === false) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-center">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-6">
          <div className="text-lg font-semibold">Access restricted</div>
          <div className="mt-2 text-sm text-neutral-500">
            You do not have admin permissions.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-500 dark:bg-neutral-500 text-neutral-900 dark:text-neutral-100 rounded-2xl">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <span className="rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1 text-xs">
              {timeframe}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === "users"
                    ? "Search users"
                    : activeTab === "bids"
                    ? "Search bids"
                    : activeTab === "notifications"
                    ? "Search notifications"
                    : "Search auctions"
                }
                className="w-64 rounded-lg border border-neutral-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 pl-10 pr-3 py-2 text-sm outline-none"
              />
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 px-3 py-2 text-sm"
            >
              <option value="7d">7d</option>
              <option value="30d">30d</option>
              <option value="90d">90d</option>
            </select>
            <button
              onClick={() => setAddUserOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add User
            </button>

            <button className="inline-flex items-center rounded-lg border border-neutral-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 px-2.5 py-2 text-sm">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users" },
            { id: "auctions", label: "Auctions" },
            { id: "bids", label: "Bids" },
            { id: "notifications", label: "Notifications" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                activeTab === t.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="text-xs text-neutral-500">Users</div>
              <div className="mt-2 text-2xl font-semibold">
                {numberFormatter.format(totals.usersTotal)}
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                Total registered
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="text-xs text-neutral-500">Auctions</div>
              <div className="mt-2 text-2xl font-semibold">
                {numberFormatter.format(totals.auctionsTotal)}
              </div>
              <div className="mt-2 text-xs text-neutral-500">Platform-wide</div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="text-xs text-neutral-500">Bids</div>
              <div className="mt-2 text-2xl font-semibold">
                {numberFormatter.format(totals.bidsTotal)}
              </div>
              <div className="mt-2 text-xs text-neutral-500">Total bids</div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="text-xs text-neutral-500">Notifications</div>
              <div className="mt-2 text-2xl font-semibold">
                {numberFormatter.format(totals.notificationsTotal)}
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                System messages
              </div>
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Users, Auctions, Bids</div>
                <Legend />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-neutral-700"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                      formatter={(value, name) => [
                        numberFormatter.format(value),
                        name,
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={false}
                      name="Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="auctions"
                      stroke="#22C55E"
                      strokeWidth={2}
                      dot={false}
                      name="Auctions"
                    />
                    <Line
                      type="monotone"
                      dataKey="bids"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={false}
                      name="Bids"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="font-medium">Platform Mix</div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sources}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                    >
                      {sources.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4 xl:col-span-2">
              <div className="font-medium">Recent Auctions</div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500">
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Creator</th>
                      <th className="px-3 py-2">Current Price</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuctions.map((a) => (
                      <tr
                        key={a.id}
                        className="border-t border-neutral-200 dark:border-neutral-700"
                      >
                        <td className="px-3 py-2 font-medium">{a.title}</td>
                        <td className="px-3 py-2">
                          {a.creator?.username || "-"}
                        </td>
                        <td className="px-3 py-2">
                          {a.current_price?.toLocaleString?.() ?? "-"}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                              a.status === "active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : a.status === "completed"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {a.created_at
                            ? new Date(a.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
              <div className="font-medium">Team</div>
              <ul className="mt-3 space-y-2">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{u.username}</div>
                      <div className="text-xs text-neutral-500">{u.email}</div>
                    </div>
                    <span className="rounded-full bg-neutral-100 dark:bg-neutral-700 px-2 py-1 text-xs">
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
            <div className="font-medium">Users</div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="px-3 py-2">Username</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Subscription</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-neutral-200 dark:border-neutral-700"
                    >
                      <td className="px-3 py-2">{u.username}</td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2">
                        {u.subscription_type || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                            u.is_active
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                          }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() =>
                            handleToggleUserActive(u.id, u.is_active)
                          }
                          className="rounded bg-indigo-600 text-white px-2 py-1 text-xs"
                        >
                          {u.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="ml-2 rounded bg-rose-600 text-white px-2 py-1 text-xs"
                        >
                          Delete
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
          <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
            <div className="font-medium">Auctions</div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Creator</th>
                    <th className="px-3 py-2">Current Price</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuctions.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t border-neutral-200 dark:border-neutral-700"
                    >
                      <td className="px-3 py-2">{a.title}</td>
                      <td className="px-3 py-2">
                        {a.creator?.username || "-"}
                      </td>
                      <td className="px-3 py-2">
                        {a.current_price?.toLocaleString?.() ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                            a.status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : a.status === "completed"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {a.created_at
                          ? new Date(a.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleToggleAuction(a)}
                          className="rounded bg-indigo-600 text-white px-2 py-1 text-xs"
                        >
                          {a.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteAuction(a.id)}
                          className="ml-2 rounded bg-rose-600 text-white px-2 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bids" && (
          <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
            <div className="font-medium">Bids</div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Auction</th>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t border-neutral-200 dark:border-neutral-700"
                    >
                      <td className="px-3 py-2">{b.id}</td>
                      <td className="px-3 py-2">{b.auction?.title || "-"}</td>
                      <td className="px-3 py-2">{b.user?.username || "-"}</td>
                      <td className="px-3 py-2">
                        {b.amount?.toLocaleString?.() ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        {b.created_at
                          ? new Date(b.created_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDeleteBid(b.id)}
                          className="rounded bg-rose-600 text-white px-2 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-4">
            <div className="font-medium">Notifications</div>
            <div className="mt-3">
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-neutral-500">{n.body}</div>
                      <div className="text-xs text-neutral-500">
                        {n.created_at
                          ? new Date(n.created_at).toLocaleString()
                          : "-"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <button
                          onClick={() => handleMarkNotificationRead(n.id)}
                          className="rounded bg-emerald-600 text-white px-2 py-1 text-xs"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(n.id)}
                        className="rounded bg-rose-600 text-white px-2 py-1 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Transition appear show={addUserOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setAddUserOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-6">
                    <Dialog.Title className="text-lg font-medium">
                      Add User
                    </Dialog.Title>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-sm">Name</label>
                        <input
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser((s) => ({ ...s, name: e.target.value }))
                          }
                          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser((s) => ({ ...s, email: e.target.value }))
                          }
                          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser((s) => ({ ...s, role: e.target.value }))
                          }
                          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-700 px-3 py-2 text-sm outline-none"
                        >
                          <option>Admin</option>
                          <option>Editor</option>
                          <option>Viewer</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => setAddUserOpen(false)}
                        className="rounded-lg border border-neutral-300 bg-white dark:bg-neutral-800 dark:border-neutral-700 px-3 py-2 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addUser}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}

export default AdminDashboard2;
