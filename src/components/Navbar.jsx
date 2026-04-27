"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, ChevronDown, Check } from "lucide-react";

function NavbarInner() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const [cities, setCities]   = useState([]);
  const [open, setOpen]       = useState(false);
  const dropdownRef           = useRef(null);

  // Derive the displayed city directly from the URL param
  const city = searchParams.get("city") || "All Cities";

  // Fetch cities from API
  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCities(data); })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Left: Logo + City picker */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">
                F<br />N
              </span>
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-gray-900">
              Fitnests
            </span>
          </Link>

          {/* City dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              {city}
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                {/* "All Cities" always first */}
                {["All Cities", ...cities.map((c) => c.name)].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setOpen(false);
                      // Build the /studios URL preserving any existing category param
                      const params = new URLSearchParams();
                      const cat = searchParams.get("category");
                      if (cat) params.set("category", cat);
                      if (name !== "All Cities") params.set("city", name);
                      const qs = params.toString();
                      router.push(`/studios${qs ? `?${qs}` : ""}`);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {name}
                    {city === name && <Check className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/list-studio"
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            List Your Studio
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}
