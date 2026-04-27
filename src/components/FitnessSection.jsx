"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_IMAGE = "/images/pilates.jpg";
const VISIBLE = 4;

export default function FitnessSection() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [index, setIndex]           = useState(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const canPrev = index > 0;
  const canNext = index + VISIBLE < categories.length;

  function prev() { if (canPrev) setIndex((i) => i - 1); }
  function next() { if (canNext) setIndex((i) => i + 1); }

  const visible = categories.slice(index, index + VISIBLE);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
            CATEGORIES
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Get Fit Your Way
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            Explore fitness categories that suit your lifestyle
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: VISIBLE }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visible.map((cat, idx) => (
              <div
                key={cat.id ?? cat.name}
                onClick={() => {
                  // Fire-and-forget view tracking
                  fetch("/api/analytics/category-view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ categoryId: cat.id, categoryName: cat.name }),
                  }).catch(() => {});
                  router.push(`/studios?category=${encodeURIComponent(cat.name)}`);
                }}
                className={`relative overflow-hidden aspect-square cursor-pointer group rounded ${
                  index === 0 && idx === 1 ? "ring-2 ring-red-500" : ""
                }`}
              >
                <img
                  src={cat.imageUrl || FALLBACK_IMAGE}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 text-white font-semibold text-sm drop-shadow">
                  {cat.name}
                </p>

                {/* Left arrow — on the first visible card */}
                {idx === 0 && categories.length > VISIBLE && canPrev && (
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    aria-label="Previous"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-800" />
                  </button>
                )}

                {/* Right arrow — on the last visible card */}
                {idx === visible.length - 1 && categories.length > VISIBLE && canNext && (
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    aria-label="Next"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-800" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dot indicators */}
        {!loading && categories.length > VISIBLE && (
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: categories.length - VISIBLE + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-red-600 w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
