"use client";

import { X } from "lucide-react";
import { Input, Textarea, SectionCard, AddButton } from "../ui";

const EMPTY_CLASS = { name: "", duration: "", price: "", description: "" };

export default function ClassesSection({ form, onChange }) {
  function handleAdd() {
    onChange("classes", [...form.classes, { ...EMPTY_CLASS }]);
  }

  function handleItemChange(index, field, value) {
    onChange(
      "classes",
      form.classes.map((cls, i) =>
        i === index ? { ...cls, [field]: value } : cls
      )
    );
  }

  function handleRemove(index) {
    onChange(
      "classes",
      form.classes.filter((_, i) => i !== index)
    );
  }

  return (
    <SectionCard
      title="Classes / Offerings"
      headerRight={<AddButton onClick={handleAdd} />}
    >
      <div className="flex flex-col gap-4">
        {form.classes.map((cls, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4"
          >
            {/* Class card header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Class {i + 1}
              </span>
              {form.classes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  aria-label={`Remove class ${i + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {/* Name + Duration */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="Class name"
                  value={cls.name}
                  onChange={(e) => handleItemChange(i, "name", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Duration (e.g. 60 min)"
                  value={cls.duration}
                  onChange={(e) => handleItemChange(i, "duration", e.target.value)}
                />
              </div>

              {/* Price */}
              <Input
                type="text"
                placeholder="Price (e.g. ₹500/session)"
                value={cls.price}
                onChange={(e) => handleItemChange(i, "price", e.target.value)}
              />

              {/* Description */}
              <Textarea
                placeholder="Description"
                value={cls.description}
                onChange={(e) => handleItemChange(i, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
