"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart2, TrendingUp, Calendar, ChevronDown, X } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toIso(date) {
  return date.toISOString();
}

function formatPeriod(period, groupBy) {
  if (!period) return "—";
  if (groupBy === "month") {
    const [y, m] = period.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleString("default", { month: "long", year: "numeric" });
  }
  if (groupBy === "week") {
    return `Week of ${period}`;
  }
  // day
  return new Date(period).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Date range presets ───────────────────────────────────────────────────────

const PRESETS = [
  { label: "Last 7 days",  days: 7  },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 1 year",  days: 365 },
];

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCards({ rows }) {
  const totalViews = rows.reduce((s, r) => s + Number(r.views), 0);

  const byCategory = rows.reduce((acc, r) => {
    acc[r.categoryName] = (acc[r.categoryName] || 0) + Number(r.views);
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const uniqueCategories = Object.keys(byCategory).length;

  const cards = [
    { label: "Total Views",       value: totalViews.toLocaleString(),       icon: TrendingUp, color: "text-red-600",  bg: "bg-red-50"  },
    { label: "Categories Tracked",value: uniqueCategories.toString(),        icon: BarChart2,  color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Top Category",      value: topCategory ? topCategory[0] : "—", icon: Calendar,   color: "text-green-600",bg: "bg-green-50"},
    { label: "Top Category Views",value: topCategory ? topCategory[1].toLocaleString() : "—", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
            <c.icon className={`w-5 h-5 ${c.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium truncate">{c.label}</p>
            <p className="text-xl font-black text-gray-900 truncate">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Bar chart (CSS only) ─────────────────────────────────────────────────────

function BarChartSection({ rows }) {
  const byCategory = rows.reduce((acc, r) => {
    acc[r.categoryName] = (acc[r.categoryName] || 0) + Number(r.views);
    return acc;
  }, {});

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = sorted[0]?.[1] || 1;

  if (!sorted.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
      <h2 className="text-base font-bold text-gray-900 mb-5">Views by Category</h2>
      <div className="flex flex-col gap-3">
        {sorted.map(([name, views]) => (
          <div key={name} className="flex items-center gap-3">
            <p className="w-32 text-sm text-gray-700 font-medium truncate shrink-0">{name}</p>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(views / max) * 100}%` }}
              />
            </div>
            <p className="w-12 text-right text-sm font-semibold text-gray-800">{views}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data table ───────────────────────────────────────────────────────────────

// Extract a comparable YYYY-MM-DD string from any period value the backend may return.
// Handles: "2026-04-24", "2026-04-24T00:00:00", "2026-04-24 00:00:00", "2026-04", etc.
function periodToDate(period) {
  if (!period) return null;
  const s = String(period).trim();
  // Grab the leading YYYY-MM-DD regardless of any trailing time / timezone content
  const dayMatch = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dayMatch) return dayMatch[1];
  // Monthly groupBy returns "YYYY-MM" — treat as the 1st of that month
  const monthMatch = s.match(/^(\d{4}-\d{2})$/);
  if (monthMatch) return `${monthMatch[1]}-01`;
  return null;
}

function DataTable({ rows, groupBy }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  const tableRows = useMemo(() => {
    if (!dateFrom && !dateTo) return rows;
    return rows.filter((r) => {
      const d = periodToDate(r.period);
      if (!d) return true;
      // dateFrom is inclusive start; dateTo is inclusive end (entire day)
      if (dateFrom && d < dateFrom) return false;
      if (dateTo   && d > dateTo)   return false;
      return true;
    });
  }, [rows, dateFrom, dateTo]);

  const hasFilter = dateFrom || dateTo;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">Detailed Breakdown</h2>

        {/* Date range pickers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            From
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            max={dateTo || undefined}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom || undefined}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {hasFilter && (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); }}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-lg px-2.5 py-1.5 hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          {hasFilter && (
            <span className="text-xs text-gray-400">
              {tableRows.length} row{tableRows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      {tableRows.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-gray-400 text-sm">No data matches the selected date range.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableRows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{r.categoryName}</td>
                  <td className="px-6 py-3 text-gray-500">{formatPeriod(r.period, groupBy)}</td>
                  <td className="px-6 py-3 text-right">
                    <span className="inline-flex items-center justify-center bg-red-50 text-red-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                      {Number(r.views).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [groupBy, setGroupBy]   = useState("day");
  const [preset, setPreset]     = useState(30);
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    const to   = new Date();
    const from = new Date();
    from.setDate(from.getDate() - preset);

    setLoading(true);
    setError(null);

    fetch(`/api/analytics/category-views?groupBy=${groupBy}&from=${toIso(from)}&to=${toIso(to)}`)
      .then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(d.error || "Failed"); });
        return r.json();
      })
      .then((data) => { if (Array.isArray(data)) setRows(data); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [groupBy, preset]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    return rows.filter((r) => r.categoryName.toLowerCase().includes(search.toLowerCase()));
  }, [rows, search]);

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Track category views over time</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {/* Group by tabs */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          {["day", "week", "month"].map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                groupBy === g ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {g === "day" ? "Daily" : g === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>

        {/* Date range preset */}
        <div className="relative">
          <select
            value={preset}
            onChange={(e) => setPreset(Number(e.target.value))}
            className="appearance-none flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {PRESETS.map((p) => (
              <option key={p.days} value={p.days}>{p.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Category search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by category…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 w-52"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 h-20 animate-pulse" />
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-xl h-48 animate-pulse" />
          <div className="bg-white border border-gray-100 rounded-xl h-64 animate-pulse" />
        </div>
      ) : (
        <>
          <SummaryCards rows={filtered} />
          <BarChartSection rows={filtered} />
          <DataTable rows={filtered} groupBy={groupBy} />
        </>
      )}
    </div>
  );
}
