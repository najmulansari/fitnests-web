"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SectionCard } from "../ui";

// Upload states
const STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  DONE: "done",
  ERROR: "error",
};

export default function ListingImageSection({ form, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(form.imageUrl || null);
  const [status, setStatus] = useState(form.imageUrl ? STATUS.DONE : STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");

  // Keep preview in sync if imageUrl is cleared from outside
  useEffect(() => {
    if (!form.imageUrl) {
      setPreview(null);
      setStatus(STATUS.IDLE);
    }
  }, [form.imageUrl]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setStatus(STATUS.UPLOADING);
    setErrorMsg("");
    onChange("imageUrl", null); // clear stale URL while uploading

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      // Replace the local blob preview with the real Vercel Blob URL
      URL.revokeObjectURL(localUrl);
      setPreview(data.url);
      setStatus(STATUS.DONE);
      onChange("imageUrl", data.url);
    } catch (err) {
      URL.revokeObjectURL(localUrl);
      setPreview(null);
      setStatus(STATUS.ERROR);
      setErrorMsg(err.message || "Upload failed. Please try again.");
      onChange("imageUrl", null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setPreview(null);
    setStatus(STATUS.IDLE);
    setErrorMsg("");
    onChange("imageUrl", null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <SectionCard title="Listing Image">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── Preview / uploading state ── */}
      {(preview || status === STATUS.UPLOADING) && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {preview && (
            <img
              src={preview}
              alt="Listing preview"
              className={`w-full h-52 object-cover transition-opacity ${
                status === STATUS.UPLOADING ? "opacity-50" : "opacity-100"
              }`}
            />
          )}

          {/* Uploading overlay */}
          {status === STATUS.UPLOADING && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-white text-xs font-semibold mt-2">Uploading…</p>
            </div>
          )}

          {/* Done badge */}
          {status === STATUS.DONE && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Uploaded
            </div>
          )}

          {/* Remove button */}
          {status !== STATUS.UPLOADING && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ── Drop zone (shown when idle or errored) ── */}
      {(status === STATUS.IDLE || status === STATUS.ERROR) && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2.5 py-14 cursor-pointer"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Click to upload image
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG or WebP — max 5 MB
            </p>
          </div>
        </button>
      )}

      {/* ── Error message ── */}
      {status === STATUS.ERROR && errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}
    </SectionCard>
  );
}
