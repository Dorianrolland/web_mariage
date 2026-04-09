"use client";

import {
  Church,
  GlassWater,
  UtensilsCrossed,
  Music,
  PartyPopper,
  Sunrise,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const events = [
  {
    time: "14h30",
    icon: Church,
    title: "Cérémonie",
    desc: "Cérémonie laïque dans le parc du Château",
    detail: "Merci d'arriver 15 minutes avant",
  },
  {
    time: "16h00",
    icon: GlassWater,
    title: "Vin d'Honneur",
    desc: "Cocktail dans la Cour d'Honneur",
    detail: "Champagne, petits fours et surprises",
  },
  {
    time: "19h30",
    icon: UtensilsCrossed,
    title: "Dîner",
    desc: "Repas gastronomique dans la Salle de Réception",
    detail: "Menu en accord mets & vins",
  },
  {
    time: "22h30",
    icon: Music,
    title: "Soirée Dansante",
    desc: "La fête commence dans la Bergerie",
    detail: "DJ set & open bar",
  },
  {
    time: "00h00",
    icon: PartyPopper,
    title: "Surprise",
    desc: "Un moment magique sous les étoiles",
    detail: "Chut... c'est une surprise !",
  },
  {
    time: "Dimanche",
    icon: Sunrise,
    title: "Brunch",
    desc: "Petit-déjeuner au bord de la piscine",
    detail: "Pour prolonger le bonheur ensemble",
  },
];

export default function ProgramSection() {
  return (
    <section id="programme" className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="font-ui mb-4 text-gold tracking-[0.3em]">
            Le Programme
          </p>
          <h2 className="font-heading mb-6 text-4xl text-navy md:text-6xl">
            Une journée{" "}
            <span className="font-display text-gold">inoubliable</span>
          </h2>
          <div className="gold-line-wide" />
          <p className="mx-auto mt-6 max-w-xl text-charcoal/70">
            Samedi 4 Septembre 2027
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-gold/40 to-gold/20 md:left-1/2" />

          {events.map((event, i) => (
            <ScrollReveal
              key={event.title}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 0.1}
              className="relative mb-12 last:mb-0"
            >
              <div
                className={`flex items-start gap-6 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Time badge (mobile: left, desktop: alternating) */}
                <div
                  className={`hidden md:flex md:w-1/2 ${
                    i % 2 === 0
                      ? "md:justify-end md:pr-10"
                      : "md:justify-start md:pl-10"
                  }`}
                >
                  <div
                    className={`rounded-full border border-gold/20 bg-cream px-5 py-2 ${
                      i % 2 === 0 ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="font-heading text-xl text-navy">
                      {event.time}
                    </span>
                  </div>
                </div>

                {/* Center icon */}
                <div className="absolute left-5 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-gold bg-cream md:left-1/2 md:-translate-x-1/2">
                  <event.icon className="h-3.5 w-3.5 text-gold" />
                </div>

                {/* Content card */}
                <div className="ml-16 md:ml-0 md:w-1/2">
                  <div
                    className={`${
                      i % 2 === 0 ? "md:pl-10" : "md:pr-10"
                    }`}
                  >
                    <div className="group rounded-xl border border-gold/10 bg-white-warm p-6 shadow-sm transition-all duration-500 hover:border-gold/25 hover:shadow-md">
                      <span className="font-ui text-xs text-gold md:hidden">
                        {event.time}
                      </span>
                      <h3 className="font-heading mt-1 text-xl text-navy md:mt-0">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-base text-charcoal/80">
                        {event.desc}
                      </p>
                      <p className="font-display mt-2 text-sm text-gold/80">
                        {event.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
