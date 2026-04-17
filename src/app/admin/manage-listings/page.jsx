"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Star,
  X,
} from "lucide-react";



// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <span className="font-medium text-gray-800">{rating.toFixed(1)}</span>
    </span>
  );
}

function ListingRow({ listing, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        <img
          src={listing.imageUrl || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&q=70"}
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
        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
          <span>{listing.city}</span>
          <span className="text-gray-300">·</span>
          <span>₹{listing.price}</span>
          <span className="text-gray-300">·</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
          <span>{listing.rating.toFixed(1)}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onView(listing)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(listing)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(listing)}
          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Category header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">{category}</h3>
        <span className="inline-flex items-center justify-center min-w-[20px] px-1.5 h-5 text-[11px] font-semibold bg-gray-100 text-gray-500 rounded-full">
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
            src={listing.imageUrl || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&q=70"}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded mb-2">
            {listing.categoryName}
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
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings");
        if (!res.ok) return;
        const data = await res.json();
        setListings(data);
      } catch {
        // silently ignore
      } finally {
        setLoadingListings(false);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const data = await res.json();
        setCategories(["All Categories", ...data.map((c) => c.name)]);
      } catch {
        setCategories(["All Categories"]);
      }
    }
    fetchCategories();
  }, []);

  // Filter listings
  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        (l.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (l.city ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" || l.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [listings, search, selectedCategory]);

  // Group by categoryName
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((l) => {
      const key = l.categoryName ?? "Uncategorised";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(l);
    });
    return map;
  }, [filtered]);

  function handleDelete(id) {
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="p-5 sm:p-6">
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
          <Link
            href="/admin/manage-listings/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Listing
          </Link>
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
                {categories.map((cat) => (
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
        {loadingListings ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : grouped.size === 0 ? (
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
            {Array.from(grouped.entries()).map(([category, items]) => (  // eslint-disable-line
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
