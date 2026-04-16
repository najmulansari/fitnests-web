import Link from "next/link";
import {
  ClipboardList,
  BarChart2,
  CreditCard,
  Users,
  Dumbbell,
  Shield,
  CalendarDays,
  UserCheck,
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const stats = [
  { value: "500+", label: "Studios Listed" },
  { value: "50K+", label: "Active Members" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const features = [
  {
    icon: ClipboardList,
    title: "Effortless Management",
    description:
      "Manage memberships, batches, and trainer schedules from a single dashboard. Assign roles and control staff access effortlessly.",
  },
  {
    icon: BarChart2,
    title: "Track Analytics",
    description:
      "Gain real-time insights on member engagement, revenue trends, lead conversion, and facility performance with powerful analytics.",
  },
  {
    icon: CreditCard,
    title: "Seamless Invoicing",
    description:
      "Simplify payments with integrated invoicing, payment links, and automated fee tracking. Export reports for streamlined accounting.",
  },
  {
    icon: Users,
    title: "Grow Your Community",
    description:
      "Connect with thousands of sports enthusiasts. Showcase your facilities and coaching programs to a large, engaged community.",
  },
];

const audiences = [
  {
    icon: Dumbbell,
    title: "Fitness Studios",
    description:
      "Digitize memberships, class bookings, and trainer management for gyms, pilates, zumba, and more.",
  },
  {
    icon: Shield,
    title: "Sports Academies",
    description:
      "Manage coaching batches, student enrollment, scheduling, and performance tracking across sports.",
  },
  {
    icon: CalendarDays,
    title: "Multi-Sport Facilities",
    description:
      "Handle multiple courts, fields, and activity areas with unified booking and operations management.",
  },
  {
    icon: UserCheck,
    title: "Women's Only Studios",
    description:
      "Create a safe, dedicated space with tailored membership plans, classes, and community features.",
  },
];

const testimonials = [
  {
    quote:
      '"ApexOps transformed how we run our cricket academy. From batch management to fee collection, everything is seamless now."',
    name: "Rajesh Kumar",
    role: "Founder | Elite Cricket Academy",
  },
  {
    quote:
      '"Managing memberships and trainer schedules across our 3 branches was a nightmare. ApexOps made it effortless from day one."',
    name: "Priya Sharma",
    role: "Director | FitZone Studios",
  },
  {
    quote:
      '"The lead tracking and conversion tools helped us grow our student base by 40% in just 6 months. Highly recommended!"',
    name: "Amit Patel",
    role: "Owner | PowerPlay Badminton",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ListYourStudioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">
                A<br />O
              </span>
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-gray-900">
              ApexOps
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/signup"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16 flex-1">
        {/* ── Hero ── */}
        <section className="relative">
          <div className="relative h-[480px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
              alt="Sports facility"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/50" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-gray-900">
                Digitize Your Sports Club
                <br />
                at{" "}
                <span className="text-red-600">0% Commission</span>
              </h1>
              <p className="mt-4 text-sm md:text-base text-gray-600 font-mono max-w-lg">
                Manage memberships, operations, leads, and more – all from one
                powerful platform built for fitness studios and sports
                academies.
              </p>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-7 py-3 transition-colors"
                >
                  Request a Demo →
                </Link>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-black text-gray-900">{value}</p>
                <p className="text-xs tracking-widest text-gray-500 font-semibold uppercase mt-1 font-mono">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Platform Features ── */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
                Platform Features
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                Everything You Need to Run Your Studio
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-200 rounded p-6"
                >
                  <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who It's For ── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
                Who It's For
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                Empower Your Business with ApexOps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {audiences.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-200 rounded p-5 flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
                Testimonials
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                Trusted by Leading Academies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map(({ quote, name, role }) => (
                <div
                  key={name}
                  className="bg-white border border-gray-200 rounded p-6 flex flex-col gap-4"
                >
                  <p className="text-sm text-gray-600 font-mono leading-relaxed flex-1">
                    {quote}
                  </p>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 bg-white text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Ready to Digitize Your Studio?
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-mono max-w-md mx-auto">
            Join 500+ studios and academies already using ApexOps
            <br className="hidden sm:block" /> to streamline their operations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-7 py-3 transition-colors"
            >
              Get Started Free →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm px-7 py-3 border border-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px] leading-none">
                A<br />O
              </span>
            </div>
            <span className="font-bold text-xs tracking-widest uppercase text-gray-900">
              ApexOps
            </span>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 ApexOps. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
