"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Heart, Share2, Clock, ChevronRight, Phone, Mail, Globe, Link2,
  MessageCircle, Star, Play,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FALLBACK_IMAGE = "/images/pilates/pilates-studio.jpg";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = "sm" }) {
  const value = parseFloat(rating) || 0;
  const cls = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i}
          className={`${cls} ${value >= i + 1 ? "fill-red-500 text-red-500" : value >= i + 0.5 ? "fill-red-200 text-red-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ category, name, fromAdmin }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5 flex-wrap">
      {fromAdmin ? (
        <Link href="/admin/manage-listings" className="hover:text-red-600 transition-colors">
          All Listings
        </Link>
      ) : (
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
      )}
      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
      {category && (
        <>
          {fromAdmin ? (
            <span>{category}</span>
          ) : (
            <Link href={`/studios?category=${encodeURIComponent(category)}`} className="hover:text-red-600 transition-colors">
              {category}
            </Link>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        </>
      )}
      <span className="text-red-600 font-medium truncate">{name}</span>
    </nav>
  );
}

// ─── Offerings card ───────────────────────────────────────────────────────────

function OfferingsCard({ classes }) {
  const [tab, setTab] = useState("classes");
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Offerings</h2>
      <div className="flex gap-4 border-b border-gray-100 mb-5">
        {["classes", "appointments"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${tab === t ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "classes" && (
        <div className="flex flex-col divide-y divide-gray-100">
          {classes?.length > 0 ? classes.map((cls, i) => (
            <div key={cls.id ?? i} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{cls.name}</p>
                  {(cls.duration || cls.description) && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 flex-wrap">
                      {cls.duration && <><Clock className="w-3 h-3 shrink-0" /><span>{cls.duration}</span></>}
                      {cls.duration && cls.description && <span className="text-gray-300 mx-0.5">·</span>}
                      {cls.description && <span className="truncate">{cls.description}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {cls.price && <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">₹{cls.price}/session</span>}
                  {/*<button className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">Book</button>*/}
                </div>
              </div>
            </div>
          )) : <p className="text-sm text-gray-400 py-4">No classes listed.</p>}
        </div>
      )}
      {tab === "appointments" && <p className="text-sm text-gray-400 py-4">Appointment booking coming soon.</p>}
    </div>
  );
}

// ─── Overview card ────────────────────────────────────────────────────────────

function OverviewCard({ overview, description }) {
  const text = overview || description;
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
      {text
        ? <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
        : <p className="text-sm text-gray-400">No overview available.</p>}
    </div>
  );
}

// ─── Program Overview card ────────────────────────────────────────────────────

function ProgramOverviewCard({ name, classes }) {
  if (!classes?.length) return null;
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{name} – Program Overview</h2>
      <ul className="flex flex-col gap-2.5">
        {classes.map((cls, i) => (
          <li key={cls.id ?? i} className="flex items-start gap-2.5 text-sm text-gray-700">
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5" />
            <span>
              <span className="font-semibold">{cls.name}</span>
              {cls.description && <span className="text-gray-500"> — {cls.description}</span>}
              {cls.duration && <span className="text-gray-400"> ({cls.duration})</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Video Tour card ──────────────────────────────────────────────────────────

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
    // not a valid URL
  }
  return null;
}

function VideoTourCard({ videoUrl }) {
  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-4 h-4 text-red-500 fill-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Video Tour</h2>
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-100">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Video Tour"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        />
      </div>
    </div>
  );
}

// ─── Reviews card ─────────────────────────────────────────────────────────────

function ReviewsCard({ rating, reviews }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews</h2>
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <span className="text-4xl font-black text-gray-900">{parseFloat(rating || 0).toFixed(1)}</span>
        <div>
          <StarRow rating={rating} size="lg" />
          <p className="text-sm text-gray-400 mt-1">{reviews ?? 0} reviews</p>
        </div>
      </div>
      <p className="text-sm text-gray-400">Be the first to leave a review for this venue.</p>
    </div>
  );
}

// ─── Contact Details sidebar card ─────────────────────────────────────────────

function ContactSidebarCard({ studio }) {
  const rows = [
    studio.phone1   && { icon: Phone,  value: studio.phone1,   href: `tel:${studio.phone1}` },
    studio.phone2   && { icon: Phone,  value: studio.phone2,   href: `tel:${studio.phone2}` },
    studio.email    && { icon: Mail,   value: studio.email,    href: `mailto:${studio.email}` },
    studio.website  && { icon: Globe,  value: "Website",       href: studio.website },
    studio.instagram && { icon: Link2, value: "Instagram",     href: studio.instagram },
  ].filter(Boolean);

  if (!rows.length) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-base font-bold text-gray-900 mb-3">Contact Details</h2>
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <a key={i} href={row.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-red-600 transition-colors group">
            <row.icon className="w-4 h-4 text-red-500 shrink-0" />
            <span className="truncate group-hover:underline">{row.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── WhatsApp card ────────────────────────────────────────────────────────────

function WhatsAppCard({ phone }) {
  const wa = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-red-50/40 flex flex-col items-center gap-3">
      <MessageCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm font-semibold text-gray-800">Connect on WhatsApp</p>
      <a href={wa} target="_blank" rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
        <Phone className="w-4 h-4" /> Contact Us!
      </a>
    </div>
  );
}

// ─── Address card ─────────────────────────────────────────────────────────────

function AddressCard({ address, city }) {
  if (!address && !city) return null;
  const query = encodeURIComponent([address, city].filter(Boolean).join(", "));
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-base font-bold text-gray-900 mb-3">Address</h2>
      {address && <p className="text-sm text-gray-700 mb-1">{address}</p>}
      {city && <p className="text-sm text-gray-600"><span className="font-medium">City:</span> {city}</p>}
      <a href={`https://maps.google.com/?q=${query}`} target="_blank" rel="noopener noreferrer"
        className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 py-2 rounded-lg transition-colors">
        <MapPin className="w-4 h-4 text-gray-400" /> Show on Map
      </a>
    </div>
  );
}

// ─── Similar Places card ──────────────────────────────────────────────────────

function SimilarPlacesCard({ currentId, categoryName }) {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const filtered = data
          .filter((l) => l.id !== Number(currentId) && l.categoryName === categoryName)
          .slice(0, 3);
        setSimilar(filtered);
      })
      .catch(() => {});
  }, [currentId, categoryName]);

  if (!similar.length) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4">Similar Places</h2>
      <div className="flex flex-col gap-4">
        {similar.map((s) => (
          <Link key={s.id} href={`/venues/${s.id}`}
            className="flex items-start gap-3 group">
            <img src={s.imageUrl || FALLBACK_IMAGE} alt={s.name}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              className="w-16 h-14 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">{s.name}</p>
              {(s.address || s.city) && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{[s.address, s.city].filter(Boolean).join(", ")}</p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-red-500 text-red-500" />
                <span className="text-xs font-medium text-gray-600">{parseFloat(s.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VenueDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const fromAdmin = searchParams.get("from") === "admin";
  const [studio, setStudio]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((data) => { if (data) setStudio(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );

  if (notFound || !studio) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1 pt-16 flex flex-col items-center justify-center gap-3">
        <p className="text-xl font-bold text-gray-800">Venue not found</p>
        <Link href="/studios" className="text-sm text-red-600 hover:underline">← Back to all venues</Link>
      </main><Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <Breadcrumb category={studio.categoryName} name={studio.name} fromAdmin={fromAdmin} />

          <h1 className="text-3xl font-black text-gray-900 mb-2">{studio.name}</h1>

          {(studio.address || studio.city) && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>{[studio.address, studio.city].filter(Boolean).join(", ")}</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setFavorited((f) => !f)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <Heart className={`w-4 h-4 ${favorited ? "fill-red-500 text-red-500" : ""}`} /> Favorite
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            {studio.exclusive && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Exclusive</span>
            )}
            {!studio.exclusive && studio.discount && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">{studio.discount}</span>
            )}
          </div>

          {/* ── Top: image + offerings ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3 rounded-xl overflow-hidden border border-gray-100">
              <img src={studio.imageUrl || FALLBACK_IMAGE} alt={studio.name}
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                className="w-full h-full object-cover max-h-[420px]" />
            </div>
            <div className="lg:col-span-2">
              <OfferingsCard classes={studio.classes ?? []} />
            </div>
          </div>

          {/* ── Bottom: left content + right sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: stacked content */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <OverviewCard overview={studio.overview} description={studio.description} />
              <ProgramOverviewCard name={studio.name} classes={studio.classes} />
              <VideoTourCard videoUrl={studio.videoUrl} />
              <ReviewsCard rating={studio.rating} reviews={studio.reviews} />
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <ContactSidebarCard studio={studio} />
              <WhatsAppCard phone={studio.phone1} />
              <AddressCard address={studio.address} city={studio.city} />
              <SimilarPlacesCard currentId={id} categoryName={studio.categoryName} />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
