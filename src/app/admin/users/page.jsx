"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, ShieldCheck, UserRound, Search, CalendarDays } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function RoleBadge({ role }) {
  const isAdmin = role?.toUpperCase() === "ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        isAdmin ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserRound className="w-3 h-3" />}
      {isAdmin ? "Admin" : "User"}
    </span>
  );
}

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCards({ users }) {
  const total   = users.length;
  const admins  = users.filter((u) => u.role?.toUpperCase() === "ADMIN").length;
  const regular = total - admins;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = users.filter((u) => {
    const d = new Date(u.createdAt || u.joinedAt || 0);
    return d.getTime() >= thirtyDaysAgo;
  }).length;

  const cards = [
    { label: "Total Users",     value: total,   icon: Users,        color: "text-red-600",    bg: "bg-red-50"    },
    { label: "Admins",          value: admins,  icon: ShieldCheck,  color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Regular Users",   value: regular, icon: UserRound,    color: "text-blue-600",   bg: "bg-blue-50"   },
    { label: "Joined (30 days)",value: recent,  icon: CalendarDays, color: "text-green-600",  bg: "bg-green-50"  },
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
            <p className="text-2xl font-black text-gray-900">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Users table ──────────────────────────────────────────────────────────────

function UsersTable({ users }) {
  if (!users.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
        <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, i) => (
              <tr key={user.id ?? i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-6 py-3.5 font-medium text-gray-900">
                  {user.fullName || "—"}
                </td>
                <td className="px-6 py-3.5 text-gray-500">{user.email || "—"}</td>
                <td className="px-6 py-3.5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-3.5 text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(d.error || "Failed to load users."); });
        return r.json();
      })
      .then((data) => { if (Array.isArray(data)) setUsers(data); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "all" ||
        (roleFilter === "admin" && u.role?.toUpperCase() === "ADMIN") ||
        (roleFilter === "user"  && u.role?.toUpperCase() !== "ADMIN");

      const q = search.toLowerCase();
      const matchSearch = !q ||
        (u.fullName ?? "").toLowerCase().includes(q) ||
        (u.email    ?? "").toLowerCase().includes(q);

      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">All registered users on the platform</p>
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
          <div className="bg-white border border-gray-100 rounded-xl h-64 animate-pulse" />
        </div>
      ) : (
        <>
          <SummaryCards users={users} />

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-64">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email…"
                className="flex-1 text-sm outline-none placeholder-gray-400 text-gray-800"
              />
            </div>

            {/* Role filter tabs */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
              {[
                { id: "all",   label: "All"    },
                { id: "admin", label: "Admins" },
                { id: "user",  label: "Users"  },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRoleFilter(opt.id)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    roleFilter === opt.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-400 ml-auto">
              {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
            </p>
          </div>

          <UsersTable users={filtered} />
        </>
      )}
    </div>
  );
}
