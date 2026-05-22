"use client";

/**
 * <HebergementSection />
 *
 * Présente les 21 gîtes du domaine et donne le mode d'emploi pratique
 * pour la nuit du 4 au 5 septembre. Les gîtes sont filtrables par type
 * (studio / cottage / famille / groupe) pour aider les invités à se
 * projeter avant de cocher la préférence dans le RSVP.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Home, Users, Hotel } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WatercolorScatter from "./WatercolorScatter";
import WatercolorAccent from "./WatercolorAccent";
import { GITES, TOTAL_CAPACITY, type GiteType } from "@/data/gites";

const FILTERS: { id: GiteType | "all"; label: string; icon: typeof Home }[] = [
  { id: "all",     label: "Tous",     icon: Hotel },
  { id: "studio",  label: "Studios",  icon: BedDouble },
  { id: "cottage", label: "Cottages", icon: Home },
  { id: "famille", label: "Familles", icon: Users },
  { id: "groupe",  label: "Groupes",  icon: Users },
];

const TYPE_LABEL: Record<GiteType, string> = {
  studio: "Studio",
  cottage: "Cottage",
  famille: "Famille",
  groupe: "Groupe",
};

export default function HebergementSection() {
  const [filter, setFilter] = useState<GiteType | "all">("all");

  const gites = useMemo(
    () => (filter === "all" ? GITES : GITES.filter((g) => g.type === filter)),
    [filter]
  );

  return (
    <section
      id="hebergement"
      className="section-padding relative overflow-hidden bg-cream paper-grain"
    >
      <WatercolorScatter
        density={2}
        mobileDensity={0}
        types={["fleur"]}
        zone="corners"
        seed={77}
        minSize={90}
        maxSize={140}
      />
      <WatercolorAccent
        id="dahlia"
        anchor="top-right"
        offset={{ top: "20px", right: "-40px" }}
        size={300}
        mobileSize={150}
        rotation={10}
        opacity={0.9}
      />
      <WatercolorAccent
        id="bouquet-coccinelle"
        anchor="bottom-left"
        offset={{ bottom: "-60px", left: "-60px" }}
        size={360}
        mobileSize={180}
        rotation={-6}
        opacity={0.9}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <p className="font-ui mb-4 tracking-[0.3em]" style={{ color: "var(--color-terracotta-dark)" }}>
            Hébergement
          </p>
          <h2 className="font-heading mb-6 text-4xl md:text-6xl" style={{ color: "var(--color-aubergine)" }}>
            21 gîtes,{" "}
            <span className="font-display" style={{ color: "var(--color-terracotta)" }}>
              tout sur place
            </span>
          </h2>
          <div className="gold-line-wide" />
          <p
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg"
            style={{ color: "var(--color-aubergine-soft)" }}
          >
            Le domaine privatisé peut accueillir{" "}
            <strong style={{ color: "var(--color-aubergine)" }}>
              jusqu&apos;à {TOTAL_CAPACITY} personnes
            </strong>{" "}
            sur place — du studio cosy pour deux au grand mas pour bandes
            d&apos;amis. Vous n&apos;avez qu&apos;à choisir votre ambiance,
            on s&apos;occupe du reste.
          </p>
        </ScrollReveal>

        {/* Filtres */}
        <ScrollReveal delay={0.15}>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className="font-ui flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] tracking-[0.25em] transition-all md:text-xs"
                  style={{
                    borderColor: active
                      ? "var(--color-terracotta)"
                      : "rgba(184,154,120,0.4)",
                    color: active
                      ? "var(--color-paper)"
                      : "var(--color-aubergine-soft)",
                    backgroundColor: active
                      ? "var(--color-terracotta)"
                      : "transparent",
                  }}
                >
                  <Icon className="h-3 w-3" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Grille gîtes */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6"
        >
          <AnimatePresence mode="popLayout">
            {gites.map((g, i) => (
              <motion.div
                key={g.number}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: (i % 12) * 0.02 }}
                className="group relative flex aspect-square flex-col items-center justify-center rounded-md p-3 text-center"
                style={{
                  backgroundColor: "var(--color-paper-soft)",
                  border: "1px solid rgba(197,138,61,0.22)",
                }}
              >
                <span
                  className="font-ui absolute right-2 top-2 text-[9px] tracking-[0.2em]"
                  style={{ color: "var(--color-saffron-dark)" }}
                >
                  N°{g.number.toString().padStart(2, "0")}
                </span>
                <h3
                  className="font-heading text-sm leading-tight md:text-base"
                  style={{ color: "var(--color-aubergine)" }}
                >
                  {g.name}
                </h3>
                <div
                  className="my-2 h-px w-6"
                  style={{ backgroundColor: "var(--color-terracotta)", opacity: 0.5 }}
                />
                <p
                  className="font-ui text-[9px] tracking-[0.2em]"
                  style={{ color: "var(--color-aubergine-soft)" }}
                >
                  {TYPE_LABEL[g.type]}
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-aubergine-light)" }}
                >
                  {g.capacity} pers.
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Info pratique */}
        <ScrollReveal delay={0.3}>
          <div
            className="mt-12 rounded-lg p-6 md:p-8"
            style={{
              backgroundColor: "rgba(246,234,212,0.6)",
              border: "1px solid rgba(197,138,61,0.2)",
            }}
          >
            <h3
              className="font-heading text-lg md:text-xl"
              style={{ color: "var(--color-aubergine)" }}
            >
              Comment ça marche ?
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed md:text-base"
              style={{ color: "var(--color-aubergine-light)" }}
            >
              Indiquez votre préférence dans le RSVP — couple, famille avec
              enfants, ou bande d&apos;amis. Nous gérons l&apos;attribution
              avec le château en fonction de votre groupe, et vous recevez
              votre numéro de gîte deux semaines avant le mariage avec un
              plan d&apos;accès.
            </p>
            <p
              className="font-ui mt-4 text-[11px] tracking-[0.2em]"
              style={{ color: "var(--color-saffron-dark)" }}
            >
              Petit-déjeuner du dimanche servi dans la Cour d&apos;Honneur ☕
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
