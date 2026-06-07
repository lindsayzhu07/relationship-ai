import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingCTA from "@/components/landing/LandingCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f6] flex flex-col">
      <LandingHero />
      <LandingFeatures />
      <LandingCTA />
    </main>
  );
}
