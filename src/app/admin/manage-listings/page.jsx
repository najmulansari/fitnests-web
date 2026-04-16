"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Star,
  MapPin,
  IndianRupee,
  X,
} from "lucide-react";

// ─── Sample data ─────────────────────────────────────────────────────────────

const LISTINGS = [
  {
    id: 1,
    category: "Cricket",
    name: "Shiv Hansa Cricket Academy",
    city: "Delhi",
    price: 503,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=120&q=70",
  },
  {
    id: 2,
    category: "Cricket",
    name: "PowerPlay Cricket Club",
    city: "Mumbai",
    price: 400,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&q=70",
  },
  {
    id: 3,
    category: "Cricket",
    name: "Champions Cricket Ground",
    city: "Bangalore",
    price: 350,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=120&q=70",
  },
  {
    id: 4,
    category: "Football",
    name: "GoalKick Football Arena",
    city: "Pune",
    price: 500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=120&q=70",
  },
  {
    id: 5,
    category: "Football",
    name: "Striker's Football Academy",
    city: "Mumbai",
    price: 450,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1551958219-acbc595b5abb?w=120&q=70",
  },
  {
    id: 6,
    category: "Football",
    name: "FC United Training Ground",
    city: "Chennai",
    price: 300,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=120&q=70",
  },
  {
    id: 7,
    category: "Badminton",
    name: "SmashPro Badminton Academy",
    city: "Hyderabad",
    price: 280,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=120&q=70",
  },
  {
    id: 8,
    category: "Badminton",
    name: "Shuttlers Court",
    city: "Kolkata",
    price: 220,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1659758862044-6d8e44c7b0db?w=120&q=70",
  },
  {
    id: 9,
    category: "Swimming",
    name: "AquaEdge Swim Academy",
    city: "Ahmedabad",
    price: 600,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=120&q=70",
  },
  {
    id: 10,
    category: "Swimming",
    name: "BlueWave Swimming Club",
    city: "Jaipur",
    price: 480,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1560090995-7d5a0a3a7c4a?w=120&q=70",
  },
  {
    id: 11,
    category: "Tennis",
    name: "AcePoint Tennis Academy",
    city: "Gurgaon",
    price: 750,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=120&q=70",
  },
  {
    id: 12,
    category: "Tennis",
    name: "Grand Slam Tennis Club",
    city: "Noida",
    price: 680,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=120&q=70",
  },
  {
    id: 13,
    category: "Fitness",
    name: "IronCore Gym & Fitness",
    city: "Delhi",
    price: 999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&q=70",
  },
  {
    id: 14,
    category: "Fitness",
    name: "FlexZone Fitness Studio",
    city: "Bangalore",
    price: 799,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&q=70",
  },
];

const CATEGORIES = ["All Categories", ...Array.from(new Set(LISTINGS.map((l) => l.category)))];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
    </span>
  );
}

function ListingRow({ listing, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
      {/* Thumbnail */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden shrink-0 bg-gray-100">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&q=70";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{listing.name}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {listing.city}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-gray-500">
            <IndianRupee className="w-3 h-3" />
            {listing.price}
          </span>
          <StarRating rating={listing.rating} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onView(listing)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          aria-label="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(listing)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          aria-label="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(listing)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function CategoryGroup({ category, listings, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Category header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-800">{category}</h3>
        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full">
          {listings.length}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {listings.map((listing) => (
          <ListingRow
            key={listing.id}
            listing={listing}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteModal({ listing, onConfirm, onCancel }) {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <h4 className="text-center text-base font-bold text-gray-900 mb-1">
          Delete Listing
        </h4>
        <p className="text-center text-sm text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{listing.name}</span>? This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(listing.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View modal ──────────────────────────────────────────────────────────────

function ViewModal({ listing, onClose }) {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-10"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img
            src={listing.image}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded mb-2">
            {listing.category}
          </span>
          <h4 className="text-base font-bold text-gray-900 mb-3">{listing.name}</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">City</p>
              <p className="font-medium text-gray-800">{listing.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Price</p>
              <p className="font-medium text-gray-800">₹{listing.price}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Rating</p>
              <StarRating rating={listing.rating} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
              <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ManageListingsPage() {
  const [listings, setListings] = useState(LISTINGS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  // Filter listings
  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.city.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" || l.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [listings, search, selectedCategory]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((l) => {
      if (!map.has(l.category)) map.set(l.category, []);
      map.get(l.category).push(l);
    });
    return map;
  }, [filtered]);

  function handleDelete(id) {
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Manage Listings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filtered.length} total listing{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded transition-colors self-start sm:self-auto shrink-0">
            <Plus className="w-4 h-4" />
            Add New Listing
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCategoryOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[160px] justify-between"
            >
              <span className="text-gray-700 font-medium">{selectedCategory}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>
            {categoryOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-red-50 text-red-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Listings */}
        {grouped.size === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search or category filter
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All Categories");
              }}
              className="mt-4 text-sm font-semibold text-red-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {Array.from(grouped.entries()).map(([category, items]) => (
              <CategoryGroup
                key={category}
                category={category}
                listings={items}
                onView={setViewTarget}
                onEdit={(l) => alert(`Edit: ${l.name}`)}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewModal listing={viewTarget} onClose={() => setViewTarget(null)} />
      <DeleteModal
        listing={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
