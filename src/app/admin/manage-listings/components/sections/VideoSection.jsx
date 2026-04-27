"use client";

import { Video } from "lucide-react";
import { FormField, Input, SectionCard } from "../ui";

function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) return embedMatch[1];
    }
  } catch {
    // not a valid URL — ignore
  }
  return null;
}

export default function VideoSection({ form, onChange }) {
  const videoId = extractYouTubeId(form.videoUrl);

  return (
    <SectionCard title="Video Tour">
      <div className="flex flex-col gap-5">
        <FormField label="YouTube Video URL">
          <div className="relative">
            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none" />
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.videoUrl}
              onChange={(e) => onChange("videoUrl", e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Accepts youtube.com/watch?v=… or youtu.be/… links
          </p>
        </FormField>

        {/* Live preview */}
        {videoId && (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video"
            />
          </div>
        )}

        {form.videoUrl && !videoId && (
          <p className="text-xs text-red-500">
            Could not parse a YouTube video ID from that URL. Please check the link.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
