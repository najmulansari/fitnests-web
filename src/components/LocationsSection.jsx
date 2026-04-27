const cities = [
  { name: "Delhi",   image: "/images/delhi.jpg" },
  { name: "Noida",   image: "/images/noida.jpg" },
  { name: "Gurgaon", image: "/images/gurgaon.jpg" },
];

export default function LocationsSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
            LOCATIONS
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Explore by City
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            Find the best fitness studios and academies in your city
          </p>
        </div>

        {/* City grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cities.map((city) => (
            <div
              key={city.name}
              className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* City label */}
              <div className="absolute bottom-5 left-5">
                <p className="text-white font-semibold text-base drop-shadow">
                  {city.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
