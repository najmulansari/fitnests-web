"use client";

import { FormField, Input, Textarea, Select, SectionCard } from "../ui";

const CATEGORIES = [
  "Cricket",
  "Football",
  "Badminton",
  "Swimming",
  "Tennis",
  "Fitness",
  "Yoga",
  "Boxing",
  "Basketball",
  "Cycling",
];

export default function BasicInfoSection({ form, onChange }) {
  return (
    <SectionCard title="Basic Information">
      <div className="flex flex-col gap-5">
        {/* Name */}
        <FormField label="Name" required>
          <Input
            type="text"
            placeholder="Studio / Academy name"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </FormField>

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <Select
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
            >
              <option value="">Select</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Price">
            <Input
              type="text"
              placeholder="₹500"
              value={form.price}
              onChange={(e) => onChange("price", e.target.value)}
            />
          </FormField>
        </div>

        {/* Rating + Reviews + Discount */}
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Rating">
            <Input
              type="text"
              placeholder="4.5"
              value={form.rating}
              onChange={(e) => onChange("rating", e.target.value)}
            />
          </FormField>
          <FormField label="Reviews">
            <Input
              type="text"
              placeholder="0"
              value={form.reviews}
              onChange={(e) => onChange("reviews", e.target.value)}
            />
          </FormField>
          <FormField label="Discount">
            <Input
              type="text"
              placeholder="e.g. 20% OFF"
              value={form.discount}
              onChange={(e) => onChange("discount", e.target.value)}
            />
          </FormField>
        </div>

        {/* Exclusive Listing */}
        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={form.exclusive}
            onChange={(e) => onChange("exclusive", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-red-600 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">Exclusive Listing</span>
        </label>

        {/* Description */}
        <FormField label="Description">
          <Textarea
            placeholder="Describe the listing..."
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </FormField>

        {/* Overview */}
        <FormField label="Overview">
          <Textarea
            placeholder="Provide an overview of the venue..."
            value={form.overview}
            onChange={(e) => onChange("overview", e.target.value)}
          />
        </FormField>

        {/* Program Overview */}
        <FormField label="Program Overview">
          <Textarea
            placeholder="Describe the programs offered..."
            value={form.programOverview}
            onChange={(e) => onChange("programOverview", e.target.value)}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
