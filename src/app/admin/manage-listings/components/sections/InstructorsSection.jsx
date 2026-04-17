"use client";

import { X } from "lucide-react";
import { Input, SectionCard, AddButton } from "../ui";

export default function InstructorsSection({ form, onChange }) {
  function handleAdd() {
    onChange("instructors", [...form.instructors, { name: "", specialty: "" }]);
  }

  function handleItemChange(index, field, value) {
    onChange(
      "instructors",
      form.instructors.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      )
    );
  }

  function handleRemove(index) {
    onChange(
      "instructors",
      form.instructors.filter((_, i) => i !== index)
    );
  }

  return (
    <SectionCard
      title="Instructors"
      headerRight={<AddButton onClick={handleAdd} />}
    >
      <div className="flex flex-col gap-3">
        {form.instructors.map((instructor, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <Input
                type="text"
                placeholder="Instructor name"
                value={instructor.name}
                onChange={(e) => handleItemChange(i, "name", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Specialty"
                value={instructor.specialty}
                onChange={(e) => handleItemChange(i, "specialty", e.target.value)}
              />
            </div>
            {form.instructors.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                aria-label="Remove instructor"
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
