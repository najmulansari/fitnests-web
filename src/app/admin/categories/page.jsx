"use client";

import { useState, useEffect } from "react";
import { Plus, X, Tag, ChevronUp, ChevronDown } from "lucide-react";
import { getSession } from "@/lib/auth";

function mapCategory(cat) {
  return {
    id: cat.id,
    name: cat.name,
    createdDate: cat.createdAt,
    createdBy: cat.createdBy,
    updatedDate: cat.updatedAt,
    updatedBy: cat.updatedBy,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Add Category Modal ───────────────────────────────────────────────────────

function AddCategoryModal({ onClose, onSubmit, createdBy }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleReset() {
    setName("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, createdBy, updatedBy: createdBy }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create category.");
        return;
      }
      onSubmit(data);
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Add New Category</h3>
            <p className="text-xs text-gray-500 mt-0.5">Create a new listing category</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Basketball, Yoga, Boxing…"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition ${
                error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
              }`}
              autoFocus
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {submitting ? "Saving…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ column, sortKey, sortDir }) {
  if (sortKey !== column) {
    return (
      <span className="inline-flex flex-col ml-1 opacity-30">
        <ChevronUp className="w-3 h-3 -mb-1" />
        <ChevronDown className="w-3 h-3" />
      </span>
    );
  }
  return sortDir === "asc" ? (
    <ChevronUp className="inline w-3.5 h-3.5 ml-1 text-red-600" />
  ) : (
    <ChevronDown className="inline w-3.5 h-3.5 ml-1 text-red-600" />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState("createdDate");
  const [sortDir, setSortDir] = useState("desc");
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (!res.ok) {
          setFetchError(data.error || "Failed to load categories.");
          return;
        }
        setCategories(data.map(mapCategory));
      } catch {
        setFetchError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...categories].sort((a, b) => {
    let av = a[sortKey] ?? "";
    let bv = b[sortKey] ?? "";
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function handleAddCategory(saved) {
    setCategories((prev) => [
      ...prev,
      {
        id: saved.id,
        name: saved.name,
        createdDate: saved.createdAt,
        createdBy: saved.createdBy,
        updatedDate: saved.updatedAt,
        updatedBy: saved.updatedBy,
      },
    ]);
    setShowModal(false);
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "createdDate", label: "Created Date" },
    { key: "createdBy", label: "Created By" },
    { key: "updatedDate", label: "Updated Date" },
    { key: "updatedBy", label: "Updated By" },
  ];

  return (
    <>
      <div className="p-5 sm:p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : fetchError ? (
            <div className="px-5 py-14 text-center">
              <p className="text-red-500 font-medium">{fetchError}</p>
              <p className="text-xs text-gray-400 mt-1">Please try refreshing the page.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-800 whitespace-nowrap"
                    >
                      {col.label}
                      <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <Tag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No categories yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click &ldquo;Add New Category&rdquo; to get started
                      </p>
                    </td>
                  </tr>
                ) : (
                  sorted.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className={`transition-colors hover:bg-gray-50 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <Tag className="w-3.5 h-3.5 text-red-500" />
                          </span>
                          <span className="font-semibold text-gray-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {formatDate(cat.createdDate)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {cat.createdBy}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {formatDate(cat.updatedDate)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {cat.updatedBy}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddCategory}
          createdBy={session?.name ?? "Admin"}
        />
      )}
    </>
  );
}
