"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutList,
  PlusCircle,
  LogOut,
  Menu,
  X,
  BarChart2,
  Settings,
  Users,
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";

// ─── Nav config ──────────────────────────────────────────────────────────────

const navSections = [
  {
    label: "Listings",
    items: [
      { href: "/admin/manage-listings", icon: LayoutList, label: "All Listings" },
      { href: "/admin/manage-listings/new", icon: PlusCircle, label: "Add New Listing" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
      <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-xs leading-none">
          F<br />N
        </span>
      </div>
      <span className="font-bold text-sm tracking-widest uppercase text-gray-900">
        Fitnests
      </span>
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ onClose }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-56 h-full bg-white border-r border-gray-100">
      {/* Logo + close button (mobile) */}
      <div className="flex items-center justify-between pr-3">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="px-5 mb-1 text-[10px] font-semibold tracking-widest uppercase text-gray-400">
              {section.label}
            </p>
            {section.items.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-red-50 text-red-600 border-r-2 border-red-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
    } else {
      setSession(s);
      setChecking(false);
    }
  }, [router]);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 flex">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar (always visible) */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-100 shrink-0">
          {/* Left: hamburger on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center logo on mobile / empty spacer on desktop */}
          <div className="flex lg:hidden items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px] leading-none">
                F<br />N
              </span>
            </div>
            <span className="font-bold text-xs tracking-widest uppercase text-gray-900">
              Fitnests
            </span>
          </div>

          {/* Desktop: greeting */}
          <p className="hidden lg:block text-sm text-gray-500">
            Welcome back,{" "}
            <span className="font-semibold text-gray-800">{session?.name}</span>
          </p>

          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors ml-auto lg:ml-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
