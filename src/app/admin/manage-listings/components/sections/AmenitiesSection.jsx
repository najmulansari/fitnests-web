"use client";

import { X } from "lucide-react";
import { Input, SectionCard, AddButton } from "../ui";

export default function AmenitiesSection({ form, onChange }) {
  function handleAdd() {
    onChange("amenities", [...form.amenities, ""]);
  }

  function handleItemChange(index, value) {
    onChange(
      "amenities",
      form.amenities.map((a, i) => (i === index ? value : a))
    );
  }

  function handleRemove(index) {
    onChange(
      "amenities",
      form.amenities.filter((_, i) => i !== index)
    );
  }

  return (
    <SectionCard
      title="Amenities"
      headerRight={<AddButton onClick={handleAdd} />}
    >
      <div className="flex flex-col gap-3">
        {form.amenities.map((amenity, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="e.g. Parking, Showers, Lockers"
              value={amenity}
              onChange={(e) => handleItemChange(i, e.target.value)}
            />
            {form.amenities.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                aria-label="Remove amenity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
