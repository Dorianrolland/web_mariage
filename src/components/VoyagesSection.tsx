"use client";

/**
 * <VoyagesSection />
 *
 * "Carnet de voyage" — les destinations qui ont mené Clémence & Dorian
 * jusqu'au Château de Chaussy. Cartes postales horizontales avec
 * scroll-snap, anecdotes, et aquarelle décorative.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { VOYAGES } from "@/data/voyages";
import { AQUARELLES } from "@/data/aquarelles";

export default function VoyagesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Très léger parallaxe vertical de l'arrière-plan
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="voyages"
      ref={ref}
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--gradient-paper-warm)" }}
    >
      {/* Halo doux en arrière-plan */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)", y: bgY }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="font-ui mb-4 tracking-[0.3em]" style={{ color: "var(--color-terracotta-dark)" }}>
            Carnet de Voyage
          </p>
          <h2 className="font-heading mb-6 text-4xl md:text-6xl" style={{ color: "var(--color-aubergine)" }}>
            Quelques pas{" "}
            <span className="font-display" style={{ color: "var(--color-terracotta)" }}>
              jusqu&apos;ici
            </span>
          </h2>
          <div className="gold-line-wide" />
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg" style={{ color: "var(--color-aubergine-soft)" }}>
            De Grenoble à Kyoto, en passant par les rizières et les marchés —
            chaque destination a écrit une page de notre histoire. Voici les
            étapes qui nous ont menés au 4 septembre 2027.
          </p>
        </ScrollReveal>

        {/* Strip horizontal scrollable */}
        <ScrollReveal delay={0.2}>
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 md:gap-8"
            style={{ scrollbarWidth: "thin" }}
          >
            {VOYAGES.map((v, i) => {
              const motif = AQUARELLES.find((a) => a.id === v.motifId) ?? AQUARELLES[0];
              return (
                <motion.article
                  key={v.id}
                  initial={{ opacity: 0, y: 30, rotate: -1 + (i % 2) * 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -1 + (i % 2) * 2 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, rotate: 0, transition: { duration: 0.3 } }}
                  className="relative flex w-[280px] shrink-0 snap-center flex-col rounded-md p-6 md:w-[340px] md:p-8"
                  style={{
                    backgroundColor: "var(--color-paper-soft)",
                    border: "1px solid rgba(197,138,61,0.25)",
                    boxShadow:
                      "0 1px 2px rgba(58,34,24,0.05), 0 8px 24px rgba(58,34,24,0.08)",
                  }}
                >
                  {/* Aquarelle décorative en filigrane (en haut à droite) */}
                  <img
                    src={motif.src}
                    srcSet={motif.srcSet}
                    sizes="120px"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 object-contain opacity-90"
                  />

                  {/* En-tête carte postale */}
                  <div className="relative flex items-baseline justify-between">
                    <span className="text-3xl" aria-hidden="true">{v.flag}</span>
                    <span
                      className="font-ui text-[10px] tracking-[0.3em]"
                      style={{ color: "var(--color-terracotta-dark)" }}
                    >
                      {v.year}
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <p
                      className="font-ui text-[10px] tracking-[0.3em]"
                      style={{ color: "var(--color-aubergine-soft)" }}
                    >
                      {v.country}
                    </p>
                    <h3
                      className="font-heading mt-1 text-3xl md:text-4xl"
                      style={{ color: "var(--color-aubergine)" }}
                    >
                      {v.city}
                    </h3>
                  </div>

                  {/* Trait décoratif */}
                  <div
                    className="my-5 h-px w-12"
                    style={{ backgroundColor: "var(--color-terracotta)" }}
                  />

                  {/* Anecdote */}
                  <p
                    className="font-display text-base leading-relaxed md:text-lg"
                    style={{ color: "var(--color-aubergine-light)" }}
                  >
                    « {v.anecdote} »
                  </p>

                  {/* Pied : coordonnées */}
                  <div
                    className="font-ui mt-auto pt-6 text-[10px] tracking-[0.2em]"
                    style={{ color: "var(--color-aubergine-soft)", opacity: 0.65 }}
                  >
                    {v.coords[0].toFixed(2)}° N · {v.coords[1].toFixed(2)}° E
                  </div>
                </motion.article>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Hint scroll */}
        <ScrollReveal delay={0.4}>
          <div
            className="font-ui mt-8 flex items-center justify-center gap-3 text-[10px] tracking-[0.3em]"
            style={{ color: "var(--color-aubergine-soft)" }}
          >
            <Compass className="h-3 w-3" />
            faites glisser pour explorer
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
