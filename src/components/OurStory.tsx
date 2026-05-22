"use client";

import { Heart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WatercolorScatter from "./WatercolorScatter";
import WatercolorAccent from "./WatercolorAccent";

// Étapes de l'histoire. Les entrées [À COMPLÉTER] sont des champs vides à remplir.
const milestones = [
  {
    year: "1ᵉʳ septembre 2017",
    title: "La Rencontre",
    text: "Le jour où tout a commencé. On ne le savait pas encore, mais cette date allait revenir presque jour pour jour, dix ans plus tard.",
  },
  {
    year: "[Année — À COMPLÉTER]",
    title: "[Étape — À COMPLÉTER]",
    text: "[Premier grand voyage / décision marquante / emménagement — à raconter ici en 2-3 lignes.]",
  },
  {
    year: "[Année — À COMPLÉTER]",
    title: "[Étape — À COMPLÉTER]",
    text: "[Autre étape intermédiaire à insérer ici — un voyage, une aventure, un projet partagé.]",
  },
  {
    year: "[Année — À COMPLÉTER] · Japon",
    title: "La Demande",
    text: "Dorian part en stage à Kyoto. Clémence le rejoint un mois plus tard — et c'est là, entre les torii et les ruelles d'Osaka, qu'un genou s'est posé au sol.",
  },
  {
    year: "4 septembre 2027",
    title: "Le Grand Jour",
    text: "Presque jour pour jour, dix ans après ce premier septembre. Cette fois, c'est au Château de Chaussy, entourés de ceux qu'on aime, qu'on se dit oui.",
  },
];

export default function OurStory() {
  return (
    <section id="histoire" className="section-padding bg-cream relative overflow-hidden paper-grain">
      <WatercolorScatter
        density={2}
        mobileDensity={0}
        types={["fleur"]}
        zone="bottom"
        seed={21}
        minSize={120}
        maxSize={180}
      />
      <WatercolorAccent
        id="dahlia"
        anchor="top-left"
        offset={{ top: "-30px", left: "-60px" }}
        size={300}
        mobileSize={160}
        rotation={-12}
        opacity={0.9}
      />
      <WatercolorAccent
        id="bouquet-coccinelle"
        anchor="bottom-right"
        offset={{ bottom: "20px", right: "-30px" }}
        size={380}
        mobileSize={200}
        rotation={6}
        opacity={0.95}
      />
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Section header */}
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="font-ui mb-4 text-gold tracking-[0.3em]">
            Notre Histoire
          </p>
          <h2 className="font-heading mb-6 text-4xl text-navy md:text-6xl">
            Deux chemins,{" "}
            <span className="font-display text-gold">une destinée</span>
          </h2>
          <div className="gold-line-wide" />
        </ScrollReveal>

        {/* Romantic quote */}
        <ScrollReveal delay={0.2} className="mb-20 text-center">
          <blockquote className="font-display mx-auto max-w-2xl text-2xl text-charcoal/80 md:text-3xl">
            &laquo; Il n&apos;y a qu&apos;un bonheur dans la vie, c&apos;est
            d&apos;aimer et d&apos;être aimé. &raquo;
          </blockquote>
          <p className="font-ui mt-4 text-stone-dark">George Sand</p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent md:left-1/2" />

          {milestones.map((milestone, i) => (
            <ScrollReveal
              key={`${i}-${milestone.year}`}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 0.15}
              className="relative mb-16 last:mb-0"
            >
              <div
                className={`flex flex-col md:flex-row md:items-center md:gap-12 ${
                  i % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                  }`}
                >
                  <span className="font-ui text-gold text-xs tracking-[0.3em]">
                    {milestone.year}
                  </span>
                  <h3 className="font-heading mt-1 text-2xl text-navy md:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-charcoal/80">
                    {milestone.text}
                  </p>
                </div>

                {/* Center dot */}
                <div className="absolute left-4 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center md:left-1/2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-cream">
                    <Heart className="h-3 w-3 text-gold" fill="currentColor" />
                  </div>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
