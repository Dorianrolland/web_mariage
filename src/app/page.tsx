"use client";

import IntroAnimation from "@/components/IntroAnimation";
import FloatingPetals from "@/components/FloatingPetals";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Ornament from "@/components/Ornament";
import OurStory from "@/components/OurStory";
import VenueSection from "@/components/VenueSection";
import ProgramSection from "@/components/ProgramSection";
import ParallaxDivider from "@/components/ParallaxDivider";
import CountdownSection from "@/components/CountdownSection";
import GallerySection from "@/components/GallerySection";
import PracticalSection from "@/components/PracticalSection";
import RSVPSection from "@/components/RSVPSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <IntroAnimation />
      <FloatingPetals />
      <CustomCursor />
      <Navigation />

      <main>
        <HeroSection />

        <Ornament />
        <OurStory />

        <ParallaxDivider
          src="/images/jardin.webp"
          alt="Le parc du Château de Chaussy"
          quote="L'amour ne se voit pas avec les yeux, mais avec l'âme."
          author="William Shakespeare"
        />

        <VenueSection />

        <Ornament />
        <ProgramSection />

        <CountdownSection />

        <Ornament />
        <GallerySection />

        <ParallaxDivider
          src="/images/ceremonie-laique.webp"
          alt="Cérémonie dans le parc"
          quote="Nous avons hâte de partager ce moment avec vous."
          author="Clémence & Dorian"
        />

        <PracticalSection />

        <Ornament />
        <RSVPSection />
      </main>

      <Footer />
    </>
  );
}
