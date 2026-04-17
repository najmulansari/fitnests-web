"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BasicInfoSection from "../components/sections/BasicInfoSection";
import AddressSection from "../components/sections/AddressSection";
import ContactSection from "../components/sections/ContactSection";
import ListingImageSection from "../components/sections/ListingImageSection";
import AmenitiesSection from "../components/sections/AmenitiesSection";
import InstructorsSection from "../components/sections/InstructorsSection";
import ClassesSection from "../components/sections/ClassesSection";

const INITIAL_FORM = {
  name: "",
  category: "",
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
  image: null,
  amenities: [""],
  instructors: [{ name: "", specialty: "" }],
  classes: [{ name: "", duration: "", price: "", description: "" }],
};

export default function AddNewListingPage() {
  const [form, setForm] = useState(INITIAL_FORM);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up to API
    console.log("New listing payload:", form);
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
        <AmenitiesSection form={form} onChange={handleChange} />
        <InstructorsSection form={form} onChange={handleChange} />
        <ClassesSection form={form} onChange={handleChange} />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-lg text-sm transition-colors mb-6"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
