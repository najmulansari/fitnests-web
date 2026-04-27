const sports = [
  {
    name: "Football",
    image: "/images/categories/football.jpg",
  },
  {
    name: "Cricket",
    image: "/images/categories/cricket.jpg",
  },
  {
    name: "Badminton",
    image: "/images/categories/badminton.jpg",
  },
  {
    name: "Swimming",
    image: "/images/categories/swimming.jpg",
  },
];

export default function SportsSection() {
  return (
    <section id="sports-coaching" className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
            Sports Coaching
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Find Your Sport
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            Top coaching academies for every sport
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sports.map((sport) => (
            <div
              key={sport.name}
              className="relative rounded-none overflow-hidden aspect-square cursor-pointer group"
            >
              <img
                src={sport.image}
                alt={sport.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">
                {sport.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
