"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BasicInfoSection from "../components/sections/BasicInfoSection";
import AddressSection from "../components/sections/AddressSection";
import ContactSection from "../components/sections/ContactSection";
import ListingImageSection from "../components/sections/ListingImageSection";
import AmenitiesSection from "../components/sections/AmenitiesSection";
import InstructorsSection from "../components/sections/InstructorsSection";
import ClassesSection from "../components/sections/ClassesSection";
import VideoSection from "../components/sections/VideoSection";
import { getSession } from "@/lib/auth";

const INITIAL_FORM = {
  name: "",
  categoryId: "",
  price: "",
  rating: "",
  reviews: "",
  discount: "",
  exclusive: false,
  description: "",
  overview: "",
  programOverview: "",
  city: "",
  address: "",
  phone1: "",
  phone2: "",
  email: "",
  website: "",
  instagram: "",
  imageUrl: null,
  videoUrl: "",
  amenities: [""],
  instructors: [{ name: "", specialty: "" }],
  classes: [{ name: "", duration: "", price: "", description: "" }],
};

export default function AddNewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Listing name is required.");
      return;
    }
    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        price: form.price !== "" ? parseFloat(form.price) : null,
        rating: form.rating !== "" ? parseFloat(form.rating) : null,
        reviews: form.reviews !== "" ? parseInt(form.reviews, 10) : 0,
        discount: form.discount || null,
        exclusive: form.exclusive,
        description: form.description || null,
        overview: form.overview || null,
        programOverview: form.programOverview || null,
        city: form.city || null,
        address: form.address || null,
        phone1: form.phone1 || null,
        phone2: form.phone2 || null,
        email: form.email || null,
        website: form.website || null,
        instagram: form.instagram || null,
        imageUrl: form.imageUrl || null,
        videoUrl: form.videoUrl || null,
        createdBy: session?.name ?? "Admin",
        amenities: form.amenities.filter((a) => a.trim() !== ""),
        instructors: form.instructors.filter((i) => i.name.trim() !== ""),
        classes: form.classes.filter((c) => c.name.trim() !== ""),
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create listing.");
        return;
      }

      router.push("/admin/manage-listings");
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <BasicInfoSection form={form} onChange={handleChange} />
        <AddressSection form={form} onChange={handleChange} />
        <ContactSection form={form} onChange={handleChange} />
        <ListingImageSection form={form} onChange={handleChange} />
        <VideoSection form={form} onChange={handleChange} />
        <AmenitiesSection form={form} onChange={handleChange} />
        <InstructorsSection form={form} onChange={handleChange} />
        <ClassesSection form={form} onChange={handleChange} />

        {error && (
          <p className="text-sm text-red-600 font-medium -mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 active:bg-red-800 text-white font-semibold py-3.5 rounded-lg text-sm transition-colors mb-6 flex items-center justify-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting ? "Creating…" : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
