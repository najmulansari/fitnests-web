"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ChevronDown, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FALLBACK_IMAGE = "/images/gym-fallback.jpg";

// ─── Star rating display ──────────────────────────────────────────────────────

function StarRow({ rating }) {
  const value = parseFloat(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled  = value >= i + 1;
        const half    = !filled && value >= i + 0.5;
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              filled ? "fill-red-500 text-red-500" : half ? "fill-red-200 text-red-400" : "text-gray-200 fill-gray-200"
            }`}
          />
        );
      })}
    </div>
  );
}

// ─── Venue card ───────────────────────────────────────────────────────────────

function VenueCard({ listing }) {
  return (
    <Link href={`/venues/${listing.id}`} className="block group">
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src={listing.imageUrl || FALLBACK_IMAGE}
            alt={listing.name}
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Badges */}
          {listing.exclusive && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Exclusive
            </span>
          )}
          {!listing.exclusive && listing.discount && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {listing.discount}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-1.5 truncate">{listing.name}</h3>

          {/* City */}
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
            <span>{listing.city || "—"}</span>
          </div>

          {/* Rating + Price row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Ratings</p>
              <StarRow rating={listing.rating} />
            </div>
            <div className="text-right">
              <p className="text-red-600 font-bold text-sm">
                ₹{listing.price ?? "—"}
              </p>
              <p className="text-[10px] text-gray-400">onwards</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Category dropdown ────────────────────────────────────────────────────────

function CategorySelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-11 min-w-[140px] text-sm text-gray-700 hover:border-gray-300 transition-colors bg-white"
      >
        <span className="flex-1 text-left truncate">{value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${value === opt ? "font-semibold text-red-600" : "text-gray-700"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────

function StudiosInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings]     = useState([]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [loading, setLoading]       = useState(true);
  const [searchText, setSearchText] = useState("");
  const [inputText, setInputText]   = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || "All Categories"
  );

  // Derive active filters directly from the URL — no effect needed
  const activeCategory = searchParams.get("category") || "All Categories";
  const activeCity     = searchParams.get("city") || "";

  // Fetch listings + categories
  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setListings(data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(["All Categories", ...data.map((c) => c.name)]);
      })
      .catch(() => {});
  }, []);

  function buildUrl(cat, city) {
    const p = new URLSearchParams();
    if (cat && cat !== "All Categories") p.set("category", cat);
    if (city) p.set("city", city);
    const qs = p.toString();
    return `/studios${qs ? `?${qs}` : ""}`;
  }

  function handleSearch(e) {
    e.preventDefault();
    setSearchText(inputText.trim());
    router.replace(buildUrl(selectedCategory, activeCity), { scroll: false });
  }

  // Apply category filter immediately when dropdown changes
  function handleCategoryChange(cat) {
    setSelectedCategory(cat);
    router.replace(buildUrl(cat, activeCity), { scroll: false });
  }

  // Client-side filter
  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchCat    = activeCategory === "All Categories" || l.categoryName === activeCategory;
      const matchCity   = !activeCity || (l.city ?? "").toLowerCase() === activeCity.toLowerCase();
      const matchSearch = !searchText ||
        (l.name ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
        (l.city ?? "").toLowerCase().includes(searchText.toLowerCase());
      return matchCat && matchCity && matchSearch;
    });
  }, [listings, activeCategory, activeCity, searchText]);

  const pageTitle = activeCategory === "All Categories" ? "All Venues" : `${activeCategory} Venues`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors mb-4">
            ← Back to Home
          </Link>

          {/* Title */}
          <h1 className="text-2xl font-black text-gray-900 mb-6">{pageTitle}</h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-4 h-11 bg-white">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Search Venue Name"
                className="flex-1 text-sm outline-none placeholder-gray-400 text-gray-800"
              />
            </div>
            <CategorySelect
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categories}
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Count */}
          {!loading && (
            <p className="text-sm text-gray-500 mb-6">
              {filtered.length} venue{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-semibold text-gray-700 mb-1">No venues found</p>
              <p className="text-sm text-gray-400">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <VenueCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Page export (wraps inner in Suspense for useSearchParams) ────────────────

export default function StudiosPage() {
  return (
    <Suspense>
      <StudiosInner />
    </Suspense>
  );
}
