"use client";

import { FormField, Input, Select, SectionCard } from "../ui";

const CITIES = [
  "Ahmedabad",
  "Bangalore",
  "Chennai",
  "Delhi",
  "Gurgaon",
  "Hyderabad",
  "Jaipur",
  "Kolkata",
  "Mumbai",
  "Noida",
  "Pune",
];

export default function AddressSection({ form, onChange }) {
  return (
    <SectionCard title="Address">
      <div className="flex flex-col gap-5">
        <FormField label="City" required>
          <Select
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
          >
            <option value="">Select</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Address">
          <Input
            type="text"
            placeholder="Full address"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
