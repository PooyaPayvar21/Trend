import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaCheckCircle, FaFilter, FaInbox, FaSearch } from "react-icons/fa";

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    try {
      const { default: api } = await import("../api/index");
      const res = await api.get("/notifications/");
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const types = useMemo(
    () => [
      { value: "all", label: "همه" },
      { value: "auction_start", label: "شروع مزایده" },
      { value: "auction_end", label: "پایان مزایده" },
      { value: "new_bid", label: "پیشنهاد جدید" },
      { value: "won_auction", label: "برنده شدن" },
      { value: "outbid", label: "پیشنهاد بالاتر" },
      { value: "auction_created", label: "مزایده ایجاد شد" },
      { value: "tender_created", label: "مناقصه ایجاد شد" },
      { value: "auction_approved", label: "مزایده تایید شد" },
      { value: "tender_approved", label: "مناقصه تایید شد" },
      { value: "auction_rejected", label: "مزایده رد شد" },
      { value: "tender_rejected", label: "مناقصه رد شد" },
      { value: "pending_approval", label: "در انتظار تایید" },
    ],
    []
  );

  const filtered = useMemo(() => {
    let data = items;
    if (typeFilter !== "all") data = data.filter((n) => n.type === typeFilter);
    if (showOnlyUnread) data = data.filter((n) => !n.read);
    if (search.trim()) {
      const q = search.trim();
      data = data.filter(
        (n) =>
          (n.message || "").includes(q) || (n.type || "").includes(q)
      );
    }
    return data;
  }, [items, typeFilter, showOnlyUnread, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const markRead = async (id) => {
    try {
      const { default: api } = await import("../api/index");
      await api.post(`/notifications/${id}/mark-read/`);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    const unread = items.filter((n) => !n.read).map((n) => n.id);
    try {
      const { default: api } = await import("../api/index");
      await Promise.all(unread.map((id) => api.post(`/notifications/${id}/mark-read/`)));
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>اعلان‌ها</h1>
        <button
          onClick={markAllRead}
          disabled={items.every((n) => n.read) || loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-50 ${
            isDarkMode
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          <FaCheckCircle />
          خواندن همه
        </button>
      </div>

      <div className={`rounded-2xl p-4 mb-6 ${isDarkMode ? "bg-[#0E2148]" : "bg-white"}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <label className={`text-sm mb-1 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>جستجو</label>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#192658] border-[#192658] text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="عبارت جستجو"
              />
              <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`} />
            </div>
          </div>
          <div>
            <label className={`text-sm mb-1 block ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>نوع</label>
            <div className="relative">
              <FaFilter className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-xl border appearance-none ${
                  isDarkMode
                    ? "bg-[#192658] border-[#192658] text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {types.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="onlyUnread"
              type="checkbox"
              checked={showOnlyUnread}
              onChange={(e) => setShowOnlyUnread(e.target.checked)}
            />
            <label htmlFor="onlyUnread" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>فقط نخوانده</label>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border ${isDarkMode ? "border-white/10 bg-[#0E2148]" : "border-gray-200 bg-white"}`}>
        {loading && (
          <div className="p-6 text-center">
            <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>در حال بارگذاری...</span>
          </div>
        )}
        {!loading && currentPageItems.length === 0 && (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <FaInbox className={`${isDarkMode ? "text-white" : "text-gray-600"}`} />
              <span className={`${isDarkMode ? "text-white" : "text-gray-600"}`}>موردی وجود ندارد</span>
            </div>
          </div>
        )}
        <ul className="divide-y divide-gray-200">
          {currentPageItems.map((n) => (
            <li key={n.id} className={`p-4 flex items-start gap-3 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
              <div className={`mt-1 w-2 h-2 rounded-full ${n.read ? "bg-gray-300" : "bg-red-500"}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className={`${isDarkMode ? "text-white" : "text-gray-900"} text-sm font-semibold`}>{types.find((t) => t.value === n.type)?.label || n.type}</div>
                  <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>{n.created_at ? new Date(n.created_at).toLocaleString("fa-IR") : ""}</div>
                </div>
                <div className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm mt-1`}>{n.message}</div>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className={`self-start text-xs px-3 py-1 rounded ${isDarkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                >
                  علامت‌خوانده
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between p-4">
          <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-xs`}>صفحه {page} از {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded text-xs disabled:opacity-50 ${isDarkMode ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              قبل
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded text-xs disabled:opacity-50 ${isDarkMode ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              بعد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;