import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const INITIAL_TODAY = [
  { name: "مناقصه", value: 0 },
  { name: "مزایده", value: 0 },
  { name: "استعلام", value: 0 },
];

const INITIAL_YESTERDAY = [
  { name: "مناقصات دیروز", value: 0 },
  { name: "استعلام های دیروز", value: 0 },
];

const monthLabel = (date) =>
  date.toLocaleDateString("fa-IR", { month: "short" });

const INITIAL_SIX_MONTH = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (5 - i));
  return { name: monthLabel(d), مناقصه: 0, مزایده: 0, استعلام: 0 };
});

const COLORS = ["#4fd1c5", "#23264d", "#f6b23c", "#8d8cf8"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
    name,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.8}
      />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#333"
        className="text-sm font-medium"
      >
        {name}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#666"
        className="text-xs"
      >
        {value.toLocaleString()}
      </text>
    </g>
  );
};

const CustomLegend = ({ payload, data, selected, onSelect }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <ul className="flex flex-col gap-2 mt-4 text-sm md:text-base items-start">
      {payload.map((entry, i) => {
        const percent = total ? ((data[i].value / total) * 100).toFixed(0) : 0;
        return (
          <li
            key={i}
            className={`flex items-center gap-2 cursor-pointer transition ${
              selected === i ? "font-bold scale-105" : ""
            }`}
            onClick={() => onSelect(i)}
          >
            <span
              className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full"
              style={{
                backgroundColor: entry.color,
                border: selected === i ? "2px solid #222" : "none",
                boxShadow: selected === i ? "0 0 0 2px #E3D095" : "none",
              }}
            ></span>
            <span className="text-[#0E2148]">
              {entry.value.toLocaleString()}
            </span>
            <span className="text-gray-500">({percent}%)</span>
          </li>
        );
      })}
    </ul>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-md text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AuctionTrendCharts = () => {
  const [activeToday, setActiveToday] = useState(null);
  const [activeYesterday, setActiveYesterday] = useState(null);
  const [selectedLines, setSelectedLines] = useState({
    مناقصه: true,
    مزایده: true,
    استعلام: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { default: api } = await import("../api/index");
        const res = await api.get("/auctions/", { params: { page_size: 1000 } });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];
        if (!cancelled) setAuctions(data);
      } catch (e) {
        if (!cancelled) setError("خطا در دریافت داده‌های نمودار");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const classifyType = (a) => {
    const cond = String(a.condition || "").toLowerCase();
    if (cond === "tender") return "مناقصه";
    return "مزایده";
  };

  const withinRange = (dt, start, end) => {
    const t = new Date(dt).getTime();
    return t >= start && t <= end;
  };

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };

  const endOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x.getTime();
  };

  const todayRange = useMemo(() => {
    const now = new Date();
    return { s: startOfDay(now), e: endOfDay(now) };
  }, []);

  const yesterdayRange = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return { s: startOfDay(y), e: endOfDay(y) };
  }, []);

  const todayData = useMemo(() => {
    if (!auctions.length) return INITIAL_TODAY;
    const counts = { مناقصه: 0, مزایده: 0, استعلام: 0 };
    auctions.forEach((a) => {
      const created = a.created_at || a.start_date;
      if (!created) return;
      if (withinRange(created, todayRange.s, todayRange.e)) {
        const t = classifyType(a);
        counts[t] += 1;
      }
    });
    return [
      { name: "مناقصه", value: counts.مناقصه },
      { name: "مزایده", value: counts.مزایده },
      { name: "استعلام", value: counts.استعلام },
    ];
  }, [auctions, todayRange]);

  const yesterdayData = useMemo(() => {
    if (!auctions.length) return INITIAL_YESTERDAY;
    let tenders = 0;
    let inquiries = 0;
    auctions.forEach((a) => {
      const created = a.created_at || a.start_date;
      if (!created) return;
      if (withinRange(created, yesterdayRange.s, yesterdayRange.e)) {
        const t = classifyType(a);
        if (t === "مناقصه") tenders += 1;
      }
    });
    return [
      { name: "مناقصات دیروز", value: tenders },
      { name: "استعلام های دیروز", value: inquiries },
    ];
  }, [auctions, yesterdayRange]);

  const areaData = useMemo(() => {
    if (!auctions.length) return INITIAL_SIX_MONTH;
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
      return { label: monthLabel(d), start, end };
    });
    const rows = months.map((m) => ({ name: m.label, مناقصه: 0, مزایده: 0, استعلام: 0 }));
    auctions.forEach((a) => {
      const created = a.created_at || a.start_date;
      if (!created) return;
      const ts = new Date(created).getTime();
      const t = classifyType(a);
      months.forEach((m, idx) => {
        if (ts >= m.start && ts <= m.end) {
          rows[idx][t] += 1;
        }
      });
    });
    return rows;
  }, [auctions]);

  // Helper for toggling selection
  const handleSelect = (current, setCurrent) => (idx) => {
    setCurrent(current === idx ? null : idx);
  };

  // Handle legend click for 6-month chart
  const handleLegendClick = (dataKey) => {
    setSelectedLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  // Custom legend for 6-month chart
  const CustomLineLegend = () => {
    const legendItems = [
      { key: 'مناقصه', color: COLORS[0] },
      { key: 'مزایده', color: COLORS[1] },
      { key: 'استعلام', color: COLORS[2] },
    ];

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {legendItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-200 px-3 py-1 rounded-lg ${
              selectedLines[item.key] 
                ? 'bg-gray-100 shadow-sm' 
                : 'opacity-50'
            }`}
            onClick={() => handleLegendClick(item.key)}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className={`text-sm font-medium ${
              selectedLines[item.key] ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {item.key}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white rounded-2xl shadow-soft p-4 md:p-6 mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#0E2148] mb-6 md:mb-10 text-center">
        نمودار
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
        {/* 6-Month Trend Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            روند 6 ماهه
          </h3>
          <div className="w-full h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tick={{ fill: '#666' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  formatter={(value) => value.toLocaleString()}
                />
                {selectedLines.مناقصه && (
                  <Line
                    type="monotone"
                    dataKey="مناقصه"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                    dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: COLORS[0], strokeWidth: 2 }}
                  />
                )}
                {selectedLines.مزایده && (
                  <Line
                    type="monotone"
                    dataKey="مزایده"
                    stroke={COLORS[1]}
                    strokeWidth={3}
                    dot={{ fill: COLORS[1], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: COLORS[1], strokeWidth: 2 }}
                  />
                )}
                {selectedLines.استعلام && (
                  <Line
                    type="monotone"
                    dataKey="استعلام"
                    stroke={COLORS[2]}
                    strokeWidth={3}
                    dot={{ fill: COLORS[2], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: COLORS[2], strokeWidth: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <CustomLineLegend />
        </div>

        {/* Today's Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-base md:text-lg font-semibold mb-2">امروز</h3>
          <div className="w-full h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={todayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeToday}
                  activeShape={renderActiveShape}
                  onClick={(_, idx) =>
                    handleSelect(activeToday, setActiveToday)(idx)
                  }
                >
                  {todayData.map((entry, index) => (
                    <Cell
                      key={`cell-today-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend
            payload={todayData.map((item, i) => ({
              value: item.name,
              color: COLORS[i % COLORS.length],
            }))}
            data={todayData}
            selected={activeToday}
            onSelect={handleSelect(activeToday, setActiveToday)}
          />
        </div>

        {/* Yesterday's Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-base md:text-lg font-semibold mb-2">دیروز</h3>
          <div className="w-full h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={yesterdayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeYesterday}
                  activeShape={renderActiveShape}
                  onClick={(_, idx) =>
                    handleSelect(activeYesterday, setActiveYesterday)(idx)
                  }
                >
                  {yesterdayData.map((entry, index) => (
                    <Cell
                      key={`cell-yesterday-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend
            payload={yesterdayData.map((item, i) => ({
              value: item.name,
              color: COLORS[i % COLORS.length],
            }))}
            data={yesterdayData}
            selected={activeYesterday}
            onSelect={handleSelect(activeYesterday, setActiveYesterday)}
          />
        </div>
      </div>
    </section>
  );
};

export default AuctionTrendCharts;
