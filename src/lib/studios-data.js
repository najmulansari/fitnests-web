export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const studios = [
  {
    name: "Shiv Hansa Cricket Academy",
    slug: "shiv-hansa-cricket-academy",
    location: "Delhi",
    sport: "Cricket",
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80",
    address: "Sector 14, Dwarka, New Delhi 110078",
    city: "Delhi",
    phone: "011 2345 6789",
    email: "info@shivhansacricketacademy.com",
    website: "www.shivhansacricketacademy.com",
    instagram: "@shivhansacricket",
    whatsapp: "919876543210",
    overview:
      "One of Delhi's premier cricket coaching academies with world-class pitches, bowling machines, and experienced coaches who have trained national-level players. We focus on technique, fitness, and match temperament.",
    programTitle: "Shiv Hansa Cricket Academy – Program Overview",
    programPoints: [
      "Beginner Batch — Fundamentals of cricket for beginners aged 8–16 (90 min)",
      "Advanced Coaching — Intensive coaching for competitive players (120 min)",
      "Weekend Camp — Full-day weekend cricket camp with match practice (4 hrs)",
    ],
    offerings: [
      { name: "Beginner Batch", duration: "90 min", description: "Fundamentals of cricket for beginners aged 8–16", price: 500 },
      { name: "Advanced Coaching", duration: "120 min", description: "Intensive coaching for competitive players", price: 800 },
      { name: "Weekend Camp", duration: "4 hrs", description: "Full-day weekend cricket camp with match practice", price: 1200 },
    ],
    appointments: [
      { slot: "Mon, 19 May · 7:00 AM", coach: "Rahul Sharma", spots: 3, price: 500 },
      { slot: "Wed, 21 May · 6:00 PM", coach: "Anil Verma", spots: 5, price: 800 },
      { slot: "Sat, 24 May · 8:00 AM", coach: "Rahul Sharma", spots: 2, price: 1200 },
    ],
    similarSlugs: ["powerplay-cricket-club", "champions-cricket-ground"],
  },
  {
    name: "PowerPlay Cricket Club",
    slug: "powerplay-cricket-club",
    location: "Mumbai",
    sport: "Cricket",
    rating: 4.5,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    address: "Andheri Sports Complex, Andheri West, Mumbai 400053",
    city: "Mumbai",
    phone: "022 4567 8901",
    email: "info@powerplaycricket.com",
    website: "www.powerplaycricket.com",
    instagram: "@powerplaycricket",
    whatsapp: "919988776655",
    overview:
      "PowerPlay Cricket Club is Mumbai's go-to academy for aspiring cricketers. Our expert coaches combine modern analytics with traditional coaching methods to develop well-rounded players ready for competitive cricket.",
    programTitle: "PowerPlay Cricket Club – Program Overview",
    programPoints: [
      "Junior Squad — Cricket basics and fun drills for kids aged 6–12 (60 min)",
      "Elite Batters Program — Technique-driven batting sessions with video analysis (90 min)",
      "All-Rounder Camp — Comprehensive training covering batting, bowling, and fielding (120 min)",
    ],
    offerings: [
      { name: "Junior Squad", duration: "60 min", description: "Cricket basics and fun drills for kids aged 6–12", price: 400 },
      { name: "Elite Batters Program", duration: "90 min", description: "Technique-driven batting sessions with video analysis", price: 700 },
      { name: "All-Rounder Camp", duration: "120 min", description: "Comprehensive training covering batting, bowling, and fielding", price: 950 },
    ],
    appointments: [
      { slot: "Tue, 20 May · 6:30 AM", coach: "Suresh Nair", spots: 4, price: 400 },
      { slot: "Thu, 22 May · 5:00 PM", coach: "Deepak Joshi", spots: 6, price: 700 },
      { slot: "Sun, 25 May · 7:00 AM", coach: "Suresh Nair", spots: 1, price: 950 },
    ],
    similarSlugs: ["shiv-hansa-cricket-academy", "champions-cricket-ground"],
  },
  {
    name: "Champions Cricket Ground",
    slug: "champions-cricket-ground",
    location: "Bangalore",
    sport: "Cricket",
    rating: 4.2,
    reviewCount: 61,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    address: "Whitefield Main Road, Bangalore 560066",
    city: "Bangalore",
    phone: "080 3456 7890",
    email: "info@championscricket.in",
    website: "www.championscricket.in",
    instagram: "@championscricket",
    whatsapp: "917654321098",
    overview:
      "Champions Cricket Ground offers professionally maintained turf pitches in the heart of Whitefield. Ideal for match practice, net sessions, and corporate cricket tournaments.",
    programTitle: "Champions Cricket Ground – Program Overview",
    programPoints: [
      "Net Practice — Open net sessions for players of all levels (60 min)",
      "Match Simulation — Full 10-over practice matches with umpires (3 hrs)",
      "Corporate Cricket — Tailored packages for office teams and events (4 hrs)",
    ],
    offerings: [
      { name: "Net Practice", duration: "60 min", description: "Open net sessions for players of all levels", price: 350 },
      { name: "Match Simulation", duration: "3 hrs", description: "Full 10-over practice matches with umpires", price: 800 },
      { name: "Corporate Cricket", duration: "4 hrs", description: "Tailored packages for office teams and events", price: 1500 },
    ],
    appointments: [
      { slot: "Mon, 19 May · 5:30 AM", coach: "Praveen Kumar", spots: 8, price: 350 },
      { slot: "Fri, 23 May · 4:00 PM", coach: "Vikas Rao", spots: 10, price: 800 },
      { slot: "Sat, 24 May · 9:00 AM", coach: "Praveen Kumar", spots: 3, price: 1500 },
    ],
    similarSlugs: ["shiv-hansa-cricket-academy", "powerplay-cricket-club"],
  },
  {
    name: "GoalKick Football Arena",
    slug: "goalkick-football-arena",
    location: "Pune",
    sport: "Football",
    rating: 4.9,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
    address: "Baner Road, Near Orchid Hotel, Pune 411045",
    city: "Pune",
    phone: "020 5678 9012",
    email: "info@goalkickarena.com",
    website: "www.goalkickarena.com",
    instagram: "@goalkickarena",
    whatsapp: "918765432109",
    overview:
      "GoalKick Football Arena is Pune's premier football training facility featuring FIFA-quality astroturf pitches, floodlights for night sessions, and professional coaches with international experience.",
    programTitle: "GoalKick Football Arena – Program Overview",
    programPoints: [
      "Youth Academy — Foundational football skills for children aged 5–14 (60 min)",
      "Pro Skills Training — Advanced positional and tactical sessions (90 min)",
      "5-a-Side Leagues — Competitive weekly leagues for adult players (2 hrs)",
    ],
    offerings: [
      { name: "Youth Academy", duration: "60 min", description: "Foundational football skills for children aged 5–14", price: 450 },
      { name: "Pro Skills Training", duration: "90 min", description: "Advanced positional and tactical sessions", price: 650 },
      { name: "5-a-Side Leagues", duration: "2 hrs", description: "Competitive weekly leagues for adult players", price: 1000 },
    ],
    appointments: [
      { slot: "Tue, 20 May · 6:00 AM", coach: "Marco D'Souza", spots: 5, price: 450 },
      { slot: "Thu, 22 May · 6:30 PM", coach: "Arjun Mehta", spots: 7, price: 650 },
      { slot: "Sun, 25 May · 8:00 AM", coach: "Marco D'Souza", spots: 4, price: 1000 },
    ],
    similarSlugs: ["strikers-football-academy", "fitzone-sports-ground"],
  },
  {
    name: "Striker's Football Academy",
    slug: "strikers-football-academy",
    location: "Mumbai",
    sport: "Football",
    rating: 4.6,
    reviewCount: 147,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    address: "Malad Sports Complex, Malad West, Mumbai 400064",
    city: "Mumbai",
    phone: "022 6789 0123",
    email: "info@strikersfootball.com",
    website: "www.strikersfootball.com",
    instagram: "@strikersmumbai",
    whatsapp: "917543210987",
    overview:
      "Striker's Football Academy is home to some of Mumbai's most talented young footballers. Our structured curriculum is designed by former ISL professionals to bring out the best in every player.",
    programTitle: "Striker's Football Academy – Program Overview",
    programPoints: [
      "Grassroots Program — Fun-based learning for beginners aged 4–10 (45 min)",
      "Competitive Training — Tactical and fitness-focused coaching (90 min)",
      "Goalkeeper Clinic — Specialised sessions for aspiring goalkeepers (60 min)",
    ],
    offerings: [
      { name: "Grassroots Program", duration: "45 min", description: "Fun-based learning for beginners aged 4–10", price: 380 },
      { name: "Competitive Training", duration: "90 min", description: "Tactical and fitness-focused coaching", price: 600 },
      { name: "Goalkeeper Clinic", duration: "60 min", description: "Specialised sessions for aspiring goalkeepers", price: 500 },
    ],
    appointments: [
      { slot: "Mon, 19 May · 7:00 AM", coach: "Ravi Pillai", spots: 6, price: 380 },
      { slot: "Wed, 21 May · 5:30 PM", coach: "Nitin Shetty", spots: 4, price: 600 },
      { slot: "Sat, 24 May · 7:30 AM", coach: "Ravi Pillai", spots: 2, price: 500 },
    ],
    similarSlugs: ["goalkick-football-arena", "fitzone-sports-ground"],
  },
  {
    name: "FitZone Sports Ground",
    slug: "fitzone-sports-ground",
    location: "Chennai",
    sport: "Football",
    rating: 4.3,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    address: "OMR Road, Sholinganallur, Chennai 600119",
    city: "Chennai",
    phone: "044 7890 1234",
    email: "info@fitzoneground.com",
    website: "www.fitzoneground.com",
    instagram: "@fitzoneground",
    whatsapp: "916543210876",
    overview:
      "FitZone Sports Ground is Chennai's most versatile outdoor sports facility. With well-maintained turf and modern amenities, it is the perfect venue for football matches, training camps, and community events.",
    programTitle: "FitZone Sports Ground – Program Overview",
    programPoints: [
      "Morning Boot Camp — High-intensity fitness and conditioning drills (60 min)",
      "Weekend Football — Organised matches for casual and semi-pro players (3 hrs)",
      "School Outreach Program — Football coaching sessions for school groups (90 min)",
    ],
    offerings: [
      { name: "Morning Boot Camp", duration: "60 min", description: "High-intensity fitness and conditioning drills", price: 300 },
      { name: "Weekend Football", duration: "3 hrs", description: "Organised matches for casual and semi-pro players", price: 700 },
      { name: "School Outreach Program", duration: "90 min", description: "Football coaching sessions for school groups", price: 250 },
    ],
    appointments: [
      { slot: "Tue, 20 May · 5:30 AM", coach: "Samuel Raj", spots: 9, price: 300 },
      { slot: "Fri, 23 May · 5:00 PM", coach: "Kiran Babu", spots: 6, price: 700 },
      { slot: "Sun, 25 May · 6:30 AM", coach: "Samuel Raj", spots: 3, price: 250 },
    ],
    similarSlugs: ["goalkick-football-arena", "strikers-football-academy"],
  },
];

export function getStudioBySlug(slug) {
  return studios.find((s) => s.slug === slug) || null;
}

export function getSimilarStudios(slugs) {
  return studios.filter((s) => slugs.includes(s.slug));
}
