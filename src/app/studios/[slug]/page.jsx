"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Heart,
  Share2,
  Phone,
  Mail,
  Globe,
  AtSign,
  MessageCircle,
  Map,
  Star,
  Clock,
  ChevronRight,
  ChevronDown,
  Play,
  ArrowLeft,
} from "lucide-react";
import { getStudioBySlug, getSimilarStudios } from "@/lib/studios-data";

const CITIES = ["All Cities", "Delhi", "Noida", "Gurgaon"];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function InlineNav() {
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="w-full bg-white text-[0.875rem]">
      <div className="w-full px-6 sm:px-16 lg:px-36 xl:px-52 flex items-center justify-between h-14">
        {/* Left: Logo + City dropdown */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">
                F<br />N
              </span>
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-gray-900">
              Fitnests
            </span>
          </Link>

          {/* All Cities dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCityOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-full px-3 py-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{selectedCity}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${cityOpen ? "rotate-180" : ""}`}
              />
            </button>

            {cityOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedCity === city
                        ? "bg-red-50 text-red-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Login */}
        <Link
          href="/login"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

// ─── Offerings panel ─────────────────────────────────────────────────────────

function OfferingsPanel({ offerings, appointments = [], className = "" }) {
  const [activeTab, setActiveTab] = useState("classes");

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col ${className}`}>
      {/* Header + tabs */}
      <div className="px-5 pt-5 pb-0 shrink-0">
        <h3 className="text-base font-bold text-gray-900 mb-3">Offerings</h3>
        <div className="flex border-b border-gray-200">
          {["classes", "appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Classes tab */}
      {activeTab === "classes" && (
        <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
          {offerings.map((o) => (
            <div key={o.name} className="px-5 py-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{o.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-500">{o.duration}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{o.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  ₹{o.price.toLocaleString("en-IN")}/session
                </span>
                <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments tab */}
      {activeTab === "appointments" && (
        <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">No appointments available.</p>
            </div>
          ) : (
            appointments.map((a, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{a.slot}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Coach: {a.coach}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.spots} spot{a.spots !== 1 ? "s" : ""} available
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    ₹{a.price.toLocaleString("en-IN")}
                  </span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors">
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Contact sidebar card ─────────────────────────────────────────────────────

function ContactCard({ phone, email, website, instagram, whatsapp }) {
  const items = [
    { icon: Phone, label: phone, href: `tel:${phone}` },
    { icon: Mail, label: email, href: `mailto:${email}` },
    { icon: Globe, label: "Website", href: `https://${website}` },
    { icon: AtSign, label: "Instagram", href: `https://instagram.com/${instagram.replace("@", "")}` },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Details</h3>
      <div className="space-y-3">
        {items.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <Icon className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{label}</span>
          </a>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4 text-center">
        <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-1.5" />
        <p className="text-xs font-semibold text-gray-700 mb-3">
          Connect on WhatsApp
        </p>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Contact Us!
        </a>
      </div>
    </div>
  );
}

// ─── Address card ─────────────────────────────────────────────────────────────

function AddressCard({ address, city }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Address</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{address}</p>
      <p className="text-sm text-gray-500 mt-1.5">
        City: <span className="font-medium text-gray-700">{city}</span>
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
      >
        <Map className="w-4 h-4 text-gray-400" />
        Show on Map
      </a>
    </div>
  );
}

// ─── Similar places card ──────────────────────────────────────────────────────

function SimilarPlacesCard({ similar }) {
  if (!similar.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Similar Places</h3>
      <div className="space-y-4">
        {similar.map((s) => (
          <Link
            key={s.slug}
            href={`/studios/${s.slug}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors leading-tight line-clamp-2">
                {s.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{s.address}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-600">{s.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Reviews section ──────────────────────────────────────────────────────────

function ReviewsSection({ rating, reviewCount }) {
  const fullStars = Math.floor(rating);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Reviews</h3>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl font-black text-red-600">{rating}</span>
        <div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < fullStars
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{reviewCount} reviews</p>
        </div>
      </div>
      <p className="text-sm text-gray-400 italic">
        Be the first to leave a review for this venue.
      </p>
    </div>
  );
}

// ─── Video tour section ───────────────────────────────────────────────────────

function VideoTourSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Video Tour</h3>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-85 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-12 h-12 rounded-full bg-white/80 shadow flex items-center justify-center">
            <Play className="w-5 h-5 text-red-500 ml-0.5" />
          </div>
          <p className="text-sm">Video tour coming soon</p>
        </div>
      </div>
    </div>
  );
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl font-black text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Studio not found</h1>
      <p className="text-sm text-gray-500 mb-6">
        The studio you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StudioDetailPage() {
  const { slug } = useParams();
  const [favorited, setFavorited] = useState(false);

  const studio = getStudioBySlug(slug);
  if (!studio) return <NotFound />;

  const similar = getSimilarStudios(studio.similarSlugs);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: studio.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-[0.875rem]">

      {/* ── Navbar: full-width, aligned with card via matching padding ── */}
      <div className="w-full bg-white border-b border-gray-200 shrink-0">
        <InlineNav />
      </div>

      {/* ── Gray area below navbar, card centered inside it ── */}
      <div className="flex-1 py-6 px-6 sm:px-16 lg:px-36 xl:px-52">

        {/* Centered bordered card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Breadcrumb */}
          <div className="border-b border-gray-200 px-6 sm:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0 text-gray-400" />
            <span>{studio.sport}</span>
            <ChevronRight className="w-3 h-3 shrink-0 text-gray-400" />
            <span className="text-red-600 font-medium truncate">{studio.name}</span>
          </div>

          {/* Studio title + actions */}
          <div className="border-b border-gray-200 px-6 sm:px-8 pt-6 pb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {studio.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              {studio.address}
            </div>
            <div className="flex items-center gap-5 mt-3">
              <button
                onClick={() => setFavorited((v) => !v)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  favorited ? "text-red-600" : "text-gray-500 hover:text-red-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? "fill-red-600 text-red-600" : ""}`} />
                Favorite
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="px-6 sm:px-8 py-6 flex flex-col gap-5">

            {/* ── Row 1: Hero image (70%) + Offerings (30%) — equal height ── */}
            <div className="flex flex-col lg:flex-row gap-5 lg:items-stretch">
              {/* Image — 50% */}
              <div className="w-full lg:w-1/2 rounded-xl overflow-hidden bg-gray-200 min-h-48">
                <img
                  src={studio.image}
                  alt={studio.name}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "inherit" }}
                />
              </div>
              {/* Offerings — 50%, stretches to match image height */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <OfferingsPanel offerings={studio.offerings} appointments={studio.appointments} className="flex-1" />
              </div>
            </div>

            {/* ── Row 2: Overview/Content (70%) + Contact/Sidebar (30%) ── */}
            <div className="flex flex-col lg:flex-row gap-5 lg:items-start">

              {/* Left — 70%: overview, program, video, reviews */}
              <div className="w-full lg:w-[70%] flex flex-col gap-5 min-w-0">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3">Overview</h3>
                  <p className="text-gray-600 leading-relaxed">{studio.overview}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3">{studio.programTitle}</h3>
                  <ul className="space-y-2.5">
                    {studio.programPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-600">
                        <span className="mt-1.5 w-2 h-2 bg-red-600 rounded-full shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <VideoTourSection />
                <ReviewsSection rating={studio.rating} reviewCount={studio.reviewCount} />
              </div>

              {/* Right — 30%: contact, address, similar */}
              <div className="w-full lg:w-[30%] flex flex-col gap-5 min-w-0">
                <ContactCard
                  phone={studio.phone}
                  email={studio.email}
                  website={studio.website}
                  instagram={studio.instagram}
                  whatsapp={studio.whatsapp}
                />
                <AddressCard address={studio.address} city={studio.city} />
                <SimilarPlacesCard similar={similar} />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Footer: full-width, outside the card, matches header ── */}
      <div className="w-full bg-white border-t border-gray-200 shrink-0">
        <div className="w-full px-6 sm:px-16 lg:px-36 xl:px-52 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px] leading-none">F<br />N</span>
            </div>
            <span className="font-bold text-xs tracking-widest uppercase text-gray-900">Fitnests</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Fitnests. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
}
