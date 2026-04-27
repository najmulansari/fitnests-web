"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, X, MapPin, ChevronUp, ChevronDown,
  Upload, Loader2, CheckCircle, AlertCircle,
  Eye, Pencil, Trash2,
} from "lucide-react";
import { getSession } from "@/lib/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapCity(city) {
  return {
    id:          city.id,
    name:        city.name,
    imageUrl:    city.imageUrl    ?? null,
    createdDate: city.createdAt,
    createdBy:   city.createdBy,
    updatedDate: city.updatedAt,
    updatedBy:   city.updatedBy,
  };
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const UP = { IDLE: "idle", UPLOADING: "uploading", DONE: "done", ERROR: "error" };

// ─── Reusable image upload field ──────────────────────────────────────────────

function ImageUploadField({ imageUrl, onImageUrl }) {
  const [preview, setPreview] = useState(imageUrl || null);
  const [status, setStatus]   = useState(imageUrl ? UP.DONE : UP.IDLE);
  const [upError, setUpError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) { setPreview(null); setStatus(UP.IDLE); }
  }, [imageUrl]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const local = URL.createObjectURL(file);
    setPreview(local); setStatus(UP.UPLOADING); setUpError(""); onImageUrl(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      URL.revokeObjectURL(local);
      setPreview(data.url); setStatus(UP.DONE); onImageUrl(data.url);
    } catch (err) {
      URL.revokeObjectURL(local);
      setPreview(null); setStatus(UP.ERROR);
      setUpError(err.message || "Upload failed. Please try again.");
      onImageUrl(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setPreview(null); setStatus(UP.IDLE); setUpError(""); onImageUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        City Image <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />

      {(preview || status === UP.UPLOADING) && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-2">
          {preview && (
            <img src={preview} alt="Preview"
              className={`w-full h-36 object-cover transition-opacity ${status === UP.UPLOADING ? "opacity-50" : ""}`} />
          )}
          {status === UP.UPLOADING && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
          {status === UP.DONE && (
            <span className="absolute top-2 left-2 flex items-center gap-1 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> Uploaded
            </span>
          )}
          {status !== UP.UPLOADING && (
            <button type="button" onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-600 transition-colors" aria-label="Remove">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {(status === UP.IDLE || status === UP.ERROR) && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2.5 py-6 cursor-pointer">
          <Upload className="w-5 h-5 text-gray-400" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-600">Click to upload image</p>
            <p className="text-xs text-gray-400">JPG, PNG or WebP — max 5 MB</p>
          </div>
        </button>
      )}
      {status === UP.ERROR && upError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{upError}
        </div>
      )}
    </div>
  );
}

// ─── Shared modal shell ───────────────────────────────────────────────────────

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Add modal ────────────────────────────────────────────────────────────────

function AddCityModal({ onClose, onSave, createdBy }) {
  const [name, setName]         = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("City name is required."); return; }
    if (uploading)  { setError("Please wait for the image to finish uploading."); return; }
    setError(""); setSubmitting(true);
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, imageUrl: imageUrl || null, createdBy, updatedBy: createdBy }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create city."); return; }
      onSave(data);
    } catch { setError("Failed to connect to the server."); }
    finally { setSubmitting(false); }
  }

  return (
    <ModalShell title="Add New City" subtitle="Create a new city location" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={name} autoFocus
            onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
            placeholder="e.g. Delhi, Mumbai, Bangalore…"
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
          />
          {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
        <ImageUploadField imageUrl={imageUrl} onImageUrl={(url) => { setImageUrl(url); setUploading(false); }} />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={() => { setName(""); setImageUrl(null); setError(""); }}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Reset
          </button>
          <button type="submit" disabled={submitting || uploading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? "Saving…" : "Submit"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── View modal ───────────────────────────────────────────────────────────────

function Detail({ label, value, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-medium text-gray-800">{value || "—"}</p>
    </div>
  );
}

function ViewCityModal({ city, onClose, onEdit }) {
  return (
    <ModalShell title="City Details" subtitle="View city information" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {city.imageUrl ? (
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <img src={city.imageUrl} alt={city.name} className="w-full h-44 object-cover" />
          </div>
        ) : (
          <div className="w-full h-32 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
            <MapPin className="w-10 h-10 text-red-300" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Detail label="Name" value={city.name} full />
          <Detail label="Created By" value={city.createdBy} />
          <Detail label="Updated By" value={city.updatedBy} />
          <Detail label="Created Date" value={formatDate(city.createdDate)} />
          <Detail label="Updated Date" value={formatDate(city.updatedDate)} />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button onClick={onEdit}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Pencil className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditCityModal({ city, onClose, onSave, updatedBy }) {
  const [name, setName]         = useState(city.name);
  const [imageUrl, setImageUrl] = useState(city.imageUrl);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("City name is required."); return; }
    setError(""); setSubmitting(true);
    try {
      const res = await fetch(`/api/cities/${city.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, imageUrl: imageUrl || null, createdBy: updatedBy, updatedBy }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update city."); return; }
      onSave(data);
    } catch { setError("Failed to connect to the server."); }
    finally { setSubmitting(false); }
  }

  return (
    <ModalShell title="Edit City" subtitle={`Editing "${city.name}"`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={name} autoFocus
            onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
            placeholder="e.g. Delhi, Mumbai, Bangalore…"
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
          />
          {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
        <ImageUploadField imageUrl={imageUrl} onImageUrl={setImageUrl} />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Delete modal ─────────────────────────────────────────────────────────────

function DeleteCityModal({ city, onClose, onDeleted }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  async function handleDelete() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/cities/${city.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete city."); return;
      }
      onDeleted(city.id);
    } catch { setError("Failed to connect to the server."); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <h4 className="text-center text-base font-bold text-gray-900 mb-1">Delete City</h4>
        <p className="text-center text-sm text-gray-500 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{city.name}</span>?
          This action cannot be undone.
        </p>
        {error && <p className="text-xs text-red-600 text-center mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={submitting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ column, sortKey, sortDir }) {
  if (sortKey !== column) return (
    <span className="inline-flex flex-col ml-1 opacity-30">
      <ChevronUp className="w-3 h-3 -mb-1" />
      <ChevronDown className="w-3 h-3" />
    </span>
  );
  return sortDir === "asc"
    ? <ChevronUp   className="inline w-3.5 h-3.5 ml-1 text-red-600" />
    : <ChevronDown className="inline w-3.5 h-3.5 ml-1 text-red-600" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CitiesPage() {
  const [cities, setCities]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [session]                   = useState(() => getSession());

  const [showAdd, setShowAdd]           = useState(false);
  const [viewTarget, setViewTarget]     = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [sortKey, setSortKey] = useState("createdDate");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCities(data.map(mapCity));
        else setFetchError(data.error || "Failed to load cities.");
      })
      .catch(() => setFetchError("Failed to connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const sorted = [...cities].sort((a, b) => {
    let av = a[sortKey] ?? ""; let bv = b[sortKey] ?? "";
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ?  1 : -1;
    return 0;
  });

  const columns = [
    { key: "name",        label: "Name" },
    { key: "createdDate", label: "Created Date" },
    { key: "createdBy",   label: "Created By" },
    { key: "updatedDate", label: "Updated Date" },
    { key: "updatedBy",   label: "Updated By" },
  ];

  return (
    <>
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Cities</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {cities.length} cit{cities.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto shrink-0">
            <Plus className="w-4 h-4" /> Add New City
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
                      <th key={col.key} onClick={() => handleSort(col.key)}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-800 whitespace-nowrap">
                        {col.label}
                        <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No cities yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add New City&rdquo; to get started</p>
                      </td>
                    </tr>
                  ) : sorted.map((city, idx) => (
                    <tr key={city.id}
                      className={`transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>

                      {/* Name + image */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {city.imageUrl ? (
                            <img src={city.imageUrl} alt={city.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-100" />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-red-500" />
                            </span>
                          )}
                          <span className="font-semibold text-gray-900">{city.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(city.createdDate)}</td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {city.createdBy}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(city.updatedDate)}</td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {city.updatedBy}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <button onClick={() => setViewTarget(city)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" aria-label="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditTarget(city)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(city)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddCityModal
          createdBy={session?.name ?? "Admin"}
          onClose={() => setShowAdd(false)}
          onSave={(saved) => { setCities((p) => [...p, mapCity(saved)]); setShowAdd(false); }}
        />
      )}

      {viewTarget && (
        <ViewCityModal
          city={viewTarget}
          onClose={() => setViewTarget(null)}
          onEdit={() => { setEditTarget(viewTarget); setViewTarget(null); }}
        />
      )}

      {editTarget && (
        <EditCityModal
          city={editTarget}
          updatedBy={session?.name ?? "Admin"}
          onClose={() => setEditTarget(null)}
          onSave={(saved) => {
            setCities((p) => p.map((c) => (c.id === saved.id ? mapCity(saved) : c)));
            setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteCityModal
          city={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={(id) => { setCities((p) => p.filter((c) => c.id !== id)); setDeleteTarget(null); }}
        />
      )}
    </>
  );
}
