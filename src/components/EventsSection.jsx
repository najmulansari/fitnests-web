import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";

const events = [
  {
    title: "ApexOps 10K Run 2026",
    venue: "Mumbai Stadium",
    date: "Apr 26, 2026",
    day: "26",
    month: "APR",
    image:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&q=80",
  },
  {
    title: "HYROX Mumbai 2026",
    venue: "NESCO Centre",
    date: "Jul 24-26, 2026",
    day: "24",
    month: "JUL",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  },
  {
    title: "National Badminton Championships",
    venue: "Shree Shiv Chhatrapati ...",
    date: "Apr 11-12, 2026",
    day: "11",
    month: "APR",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80",
  },
  {
    title: "Inter-Club Cricket Tournament",
    venue: "Wankhede Stadium Grounds",
    date: "May 3-5, 2026",
    day: "3",
    month: "MAY",
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80",
  },
  {
    title: "Zumba Fitness Festival",
    venue: "Jawaharlal Nehru Stadium",
    date: "May 18, 2026",
    day: "18",
    month: "MAY",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  },
  {
    title: "SwimFest Aqua Marathon 2026",
    venue: "Aqua Sports Complex",
    date: "Jun 7, 2026",
    day: "7",
    month: "JUN",
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80",
  },
];

export default function EventsSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-2">
              Events
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Upcoming Sports &amp; Fitness Events
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-mono">
              Stay updated on marathons, workshops &amp; tournaments near you
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-red-600 hover:text-red-700 whitespace-nowrap ml-6 transition-colors"
          >
            View All Events →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {events.map((event) => (
            <div
              key={event.title}
              className="flex-shrink-0 w-48 md:w-52 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute top-0 left-0 bg-red-600 text-white text-center px-2 py-1 min-w-[2.5rem]">
                  <p className="text-xs font-bold leading-none">{event.day}</p>
                  <p className="text-[9px] font-semibold leading-none mt-0.5 tracking-wide">
                    {event.month}
                  </p>
                </div>
              </div>

              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                  {event.title}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-500 truncate">
                    {event.venue}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
