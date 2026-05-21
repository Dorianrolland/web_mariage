"use client";

import IntroAnimation from "@/components/IntroAnimation";
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
      <CustomCursor />
      <Navigation />

      <main>
        <HeroSection />

        <div className="section-fade" />
        <Ornament />
        <OurStory />

        <ParallaxDivider
          src="/images/jardin.webp"
          alt="Le parc du Château de Chaussy"
          quote="L'amour ne se voit pas avec les yeux, mais avec l'âme."
          author="William Shakespeare"
        />

        <div className="section-fade" />
        <VenueSection />

        <Ornament />
        <ProgramSection />

        <div className="section-fade" />
        <CountdownSection />

        <Ornament />
        <GallerySection />

        <ParallaxDivider
          src="/images/ceremonie-laique.webp"
          alt="Cérémonie dans le parc"
          quote="Nous avons hâte de partager ce moment avec vous."
          author="Clémence & Dorian"
        />

        <div className="section-fade" />
        <PracticalSection />

        <Ornament />
        <RSVPSection />
      </main>

      <Footer />
    </>
  );
}
