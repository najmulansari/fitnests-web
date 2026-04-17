"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { SectionCard } from "../ui";

export default function ListingImageSection({ form, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    onChange("image", file);
  }

  function handleRemove() {
    onChange("image", null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <SectionCard title="Listing Image">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Listing preview"
            className="w-full h-52 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2.5 py-14 cursor-pointer"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Click to upload image</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 5MB</p>
          </div>
        </button>
      )}
    </SectionCard>
  );
}
