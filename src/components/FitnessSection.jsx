const fitnessCategories = [
  {
    name: "Pilates",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  },
  {
    name: "Premium Gyms",
    image:
      "https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?w=600&q=80",
    highlighted: true,
  },
  {
    name: "Zumba",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    name: "Women's Only Fitness",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
  },
];

export default function FitnessSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.2em] text-gray-500 font-semibold uppercase font-mono mb-3">
            Fitness Clubs
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Get Fit Your Way
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            Premium fitness studios and clubs near you
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fitnessCategories.map((category) => (
            <div
              key={category.name}
              className={`relative overflow-hidden aspect-square cursor-pointer group ${
                category.highlighted ? "ring-2 ring-red-500" : ""
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
