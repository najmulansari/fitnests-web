import Link from "next/link";
import { Users, MapPin, Trophy, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "ACTIVE MEMBERS" },
  { icon: MapPin, value: "500+", label: "LOCATIONS" },
  { icon: Trophy, value: "40+", label: "SPORTS & ACTIVITIES" },
  { icon: Star, value: "4.8", label: "AVERAGE RATING" },
];

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Hero image area */}
      <div className="relative h-[520px] overflow-hidden">
        <img
          src="/images/gym-hero.jpg"
          alt="Fitness gym"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Fade to white at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-black drop-shadow-sm">
            Your Gateway to{" "}
            <span className="text-red-600">Sports</span>
            <br />
            &amp; <span className="text-red-600">Fitness</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-700 font-mono max-w-md">
            Discover coaching academies, fitness studios and
            <br className="hidden sm:block" /> sports facilities near you.
          </p>
          <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 transition-colors"
            >
              Get Started →
            </Link>
            <Link
              href="#sports-coaching"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm px-6 py-3 border border-gray-300 transition-colors"
            >
              Explore Sports
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-[10px] tracking-widest text-gray-500 font-semibold uppercase mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
