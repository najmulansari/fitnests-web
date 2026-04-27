"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BasicInfoSection from "../../components/sections/BasicInfoSection";
import AddressSection from "../../components/sections/AddressSection";
import ContactSection from "../../components/sections/ContactSection";
import ListingImageSection from "../../components/sections/ListingImageSection";
import AmenitiesSection from "../../components/sections/AmenitiesSection";
import InstructorsSection from "../../components/sections/InstructorsSection";
import ClassesSection from "../../components/sections/ClassesSection";
import VideoSection from "../../components/sections/VideoSection";

// Map the API response → form shape
function toForm(data) {
  return {
    name:            data.name            ?? "",
    categoryId:      data.categoryId      ?? "",
    price:           data.price           != null ? String(data.price)   : "",
    rating:          data.rating          != null ? String(data.rating)  : "",
    reviews:         data.reviews         != null ? String(data.reviews) : "",
    discount:        data.discount        ?? "",
    exclusive:       data.exclusive       ?? false,
    description:     data.description     ?? "",
    overview:        data.overview        ?? "",
    programOverview: data.programOverview ?? "",
    city:            data.city            ?? "",
    address:         data.address         ?? "",
    phone1:          data.phone1 ?? data.phone  ?? "",
    phone2:          data.phone2          ?? "",
    email:           data.email           ?? "",
    website:         data.website         ?? "",
    instagram:       data.instagram       ?? "",
    imageUrl:        data.imageUrl        ?? null,
    videoUrl:        data.videoUrl        ?? "",
    amenities: Array.isArray(data.amenities) && data.amenities.length
      ? data.amenities.map((a) => (typeof a === "string" ? a : a.name ?? ""))
      : [""],
    instructors: Array.isArray(data.instructors) && data.instructors.length
      ? data.instructors.map((i) => ({ name: i.name ?? "", specialty: i.specialty ?? "" }))
      : [{ name: "", specialty: "" }],
    classes: Array.isArray(data.classes) && data.classes.length
      ? data.classes.map((c) => ({
          name:        c.name        ?? "",
          duration:    c.duration    ?? "",
          price:       c.price       != null ? String(c.price) : "",
          description: c.description ?? "",
        }))
      : [{ name: "", duration: "", price: "", description: "" }],
  };
}

export default function EditListingPage() {
  const router = useRouter();
  const { id }  = useParams();

  const [form, setForm]           = useState(null);        // null = loading
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Fetch existing listing ────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setForm(toForm(data)))
      .catch(() => setLoadError("Failed to load listing. Please go back and try again."));
  }, [id]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setSubmitError("Listing name is required.");
      return;
    }
    if (!form.categoryId) {
      setSubmitError("Please select a category.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = {
        name:            form.name.trim(),
        categoryId:      form.categoryId ? Number(form.categoryId) : null,
        price:           form.price   !== "" ? parseFloat(form.price)         : null,
        rating:          form.rating  !== "" ? parseFloat(form.rating)        : null,
        reviews:         form.reviews !== "" ? parseInt(form.reviews, 10)     : 0,
        discount:        form.discount        || null,
        exclusive:       form.exclusive,
        description:     form.description     || null,
        overview:        form.overview        || null,
        programOverview: form.programOverview || null,
        city:            form.city            || null,
        address:         form.address         || null,
        phone1:          form.phone1          || null,
        phone2:          form.phone2          || null,
        email:           form.email           || null,
        website:         form.website         || null,
        instagram:       form.instagram       || null,
        imageUrl:        form.imageUrl        || null,
        videoUrl:        form.videoUrl        || null,
        amenities:   form.amenities.filter((a) => a.trim() !== ""),
        instructors: form.instructors.filter((i) => i.name.trim() !== ""),
        classes:     form.classes.filter((c) => c.name.trim() !== ""),
      };

      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to update listing.");
        return;
      }

      router.push("/admin/manage-listings");
    } catch {
      setSubmitError("Failed to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-5 sm:p-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/admin/manage-listings"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Edit Listing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update the details below and save.</p>
      </div>

      {/* Loading state */}
      {!form && !loadError && (
        <div className="flex items-center justify-center py-24">
          <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Load error */}
      {loadError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Form — only shown once data is loaded */}
      {form && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <BasicInfoSection    form={form} onChange={handleChange} />
          <AddressSection      form={form} onChange={handleChange} />
          <ContactSection      form={form} onChange={handleChange} />
          <ListingImageSection form={form} onChange={handleChange} />
          <VideoSection        form={form} onChange={handleChange} />
          <AmenitiesSection    form={form} onChange={handleChange} />
          <InstructorsSection  form={form} onChange={handleChange} />
          <ClassesSection      form={form} onChange={handleChange} />

          {submitError && (
            <p className="text-sm text-red-600 font-medium -mt-2">{submitError}</p>
          )}

          <div className="flex gap-3 mb-6">
            <Link
              href="/admin/manage-listings"
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-3.5 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
