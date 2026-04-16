import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SportsSection from "@/components/SportsSection";
import FitnessSection from "@/components/FitnessSection";
import FeaturedStudios from "@/components/FeaturedStudios";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <SportsSection />
        <FitnessSection />
        <FeaturedStudios />
        <EventsSection />
        <Footer />
      </div>
    </main>
  );
}
