"use client";

import { FormField, Input, SectionCard } from "../ui";

export default function ContactSection({ form, onChange }) {
  return (
    <SectionCard title="Contact Details">
      <div className="flex flex-col gap-5">
        {/* Phone numbers */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone Number 1">
            <Input
              type="tel"
              placeholder="011-XXXX-XXXX"
              value={form.phone1}
              onChange={(e) => onChange("phone1", e.target.value)}
            />
          </FormField>
          <FormField label="Phone Number 2">
            <Input
              type="tel"
              placeholder="011-XXXX-XXXX (optional)"
              value={form.phone2}
              onChange={(e) => onChange("phone2", e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Email">
          <Input
            type="email"
            placeholder="contact@studio.com"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </FormField>

        <FormField label="Website">
          <Input
            type="url"
            placeholder="https://www.example.com"
            value={form.website}
            onChange={(e) => onChange("website", e.target.value)}
          />
        </FormField>

        <FormField label="Instagram">
          <Input
            type="text"
            placeholder="@studiohandle"
            value={form.instagram}
            onChange={(e) => onChange("instagram", e.target.value)}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
