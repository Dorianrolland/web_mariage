"use client";

import { Heart, Calendar, CalendarPlus, Music, MapPin, Download } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import WatercolorScatter from "./WatercolorScatter";
import Monogram from "./Monogram";

function generateCalendarUrl() {
  const event = {
    title: "Mariage Clémence & Dorian",
    date: "20270904T123000Z",
    endDate: "20270905T160000Z",
    location: "Château de Chaussy, 64 Avenue de Vallon, 07120 Ruoms, Ardèche",
    details:
      "Nous avons la joie de vous accueillir pour notre mariage au Château de Chaussy.",
  };

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${event.date}/${event.endDate}&location=${encodeURIComponent(
    event.location
  )}&details=${encodeURIComponent(event.details)}`;
}

function downloadICS() {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mariage C&D//FR
BEGIN:VEVENT
DTSTART:20270904T123000Z
DTEND:20270905T160000Z
SUMMARY:Mariage Clémence & Dorian
LOCATION:Château de Chaussy, 64 Avenue de Vallon, 07120 Ruoms, Ardèche
DESCRIPTION:Nous avons la joie de vous accueillir pour notre mariage au Château de Chaussy. Arrivée dès 14h30 pour la cérémonie.
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Mariage Clémence & Dorian dans 1 semaine !
END:VALARM
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Mariage Clémence & Dorian demain !
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mariage-clemence-dorian.ics";
  link.click();
  URL.revokeObjectURL(url);
}

const bonusLinks = [
  {
    icon: Calendar,
    label: "Google Calendar",
    href: generateCalendarUrl(),
    external: true,
    onClick: undefined as (() => void) | undefined,
  },
  {
    icon: CalendarPlus,
    label: "Télécharger .ics",
    href: "#",
    external: false,
    onClick: downloadICS,
    hint: "Apple Calendar, Outlook...",
  },
  {
    icon: MapPin,
    label: "Itinéraire GPS",
    href: "https://www.google.com/maps/dir/?api=1&destination=64+Avenue+de+Vallon+07120+Ruoms+France",
    external: true,
    onClick: undefined as (() => void) | undefined,
  },
  {
    icon: Music,
    label: "Suggérer un titre",
    href: "#rsvp",
    external: false,
    onClick: undefined as (() => void) | undefined,
    hint: "Dans le formulaire RSVP",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy pb-8 pt-16">
      <WatercolorScatter
        density={2}
        mobileDensity={1}
        types={["insecte"]}
        zone="corners"
        seed={66}
        minSize={80}
        maxSize={130}
        opacityScale={0.85}
      />
      {/* Decorative top border */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(201,169,110,0.3) 1px, transparent 0)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Bonus action buttons */}
        <ScrollReveal className="mb-16">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {bonusLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.onClick ? "#" : link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={
                  link.onClick
                    ? (e: React.MouseEvent) => {
                        e.preventDefault();
                        link.onClick!();
                      }
                    : undefined
                }
                className="group flex flex-col items-center gap-2 rounded-lg border border-gold/10 p-4 text-center transition-all duration-300 hover:border-gold/30 hover:bg-cream/5"
                whileHover={{ y: -2 }}
              >
                <link.icon className="h-5 w-5 text-gold/70 transition-colors group-hover:text-gold" />
                <div>
                  <span className="font-ui text-xs text-cream/80">
                    {link.label}
                  </span>
                  {"hint" in link && link.hint && (
                    <p className="text-[11px] text-cream/55">{link.hint}</p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </ScrollReveal>

        {/* Main footer content */}
        <ScrollReveal delay={0.2} className="text-center">
          {/* Monogramme — signature de clôture (inversé sur fond sombre) */}
          <div className="mb-8 flex justify-center">
            <Monogram size={240} opacity={0.7} invert />
          </div>

          <p className="font-display mb-2 text-xl text-cream/60">
            4 Septembre 2027
          </p>
          <p className="font-ui text-xs text-cream/50 tracking-[0.3em]">
            Château de Chaussy &middot; Ruoms, Ardèche
          </p>

          <div className="mx-auto my-8 h-px w-16 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          {/* Hashtag */}
          <p className="font-ui mb-6 text-xs text-gold/60 tracking-[0.2em]">
            #ClemenceEtDorian
          </p>

          {/* Love note */}
          <p className="font-display mx-auto max-w-md text-sm text-cream/60">
            &laquo; Que l&apos;amour qui nous unit ce jour soit le phare
            qui guide notre chemin pour toujours. &raquo;
          </p>

          <div className="mt-10 flex items-center justify-center gap-1 text-cream/40">
            <span className="text-xs">Made with</span>
            <Heart className="h-3 w-3 text-rose/50" fill="currentColor" />
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
