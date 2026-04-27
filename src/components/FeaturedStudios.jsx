"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

const FALLBACK_IMAGE = "/images/gym-fallback.jpg";
const FEATURED_COUNT = 8;

export default function FeaturedStudios() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setListings(data.slice(0, FEATURED_COUNT));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-2">
              Featured
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Featured Fitness Studios
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-mono">
              Explore trusted studios &amp; academies with top trainers and
              facilities
            </p>
          </div>
          <Link
            href="/studios"
            className="text-sm font-semibold text-red-600 hover:text-red-700 whitespace-nowrap ml-6 transition-colors"
          >
            Explore All →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 md:w-52 border border-gray-100 rounded overflow-hidden"
                >
                  <div className="w-full h-36 bg-gray-100 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))
            : listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/venues/${listing.id}`}
                  className="flex-shrink-0 w-48 md:w-52 border border-gray-200 hover:shadow-md hover:border-red-200 transition-all duration-200 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={listing.imageUrl || FALLBACK_IMAGE}
                      alt={listing.name}
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {listing.rating && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5">
                        <Star className="w-3 h-3 fill-white" />
                        {parseFloat(listing.rating).toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-semibold text-red-600 leading-tight group-hover:text-red-700 transition-colors truncate">
                      {listing.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-500 truncate">{listing.city || "—"}</span>
                    </div>
                    {listing.categoryName && (
                      <p className="text-xs text-red-500 font-medium mt-1 truncate">
                        {listing.categoryName}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
