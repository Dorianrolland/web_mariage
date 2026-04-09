"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  MapPin,
  Car,
  Train,
  Plane,
  BedDouble,
  TreePine,
  Waves,
  UtensilsCrossed,
  Landmark,
  ExternalLink,
  Mountain,
  Grape,
  History,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="image-placeholder flex h-full w-full items-center justify-center rounded-lg">
      Chargement de la carte...
    </div>
  ),
});

const features = [
  {
    icon: TreePine,
    title: "Parc de 5 hectares",
    desc: "Cour d'Honneur de 225m² pour le cocktail et parc arboré pour la cérémonie",
  },
  {
    icon: UtensilsCrossed,
    title: "Bergerie voûtée",
    desc: "100m² de pierres et voûtes pour le dîner, avec annexe et terrasse couverte",
  },
  {
    icon: Landmark,
    title: "Salle d'Époque",
    desc: "75m² avec cheminée ancienne, lustres en pampilles et mobilier d'époque",
  },
  {
    icon: BedDouble,
    title: "21 Gîtes sur place",
    desc: "135 couchages en pierres de pays, terrasses privatives et climatisation",
  },
  {
    icon: Waves,
    title: "Espace Aquatique",
    desc: "Piscine chauffée, pataugeoire enfants et espaces détente",
  },
];

const access = [
  {
    icon: Car,
    title: "En voiture",
    desc: "A7 sortie Montélimar Sud, puis D4/D579 vers Ruoms (~45 min). Parking privé sur place.",
  },
  {
    icon: Train,
    title: "En train",
    desc: "Gare de Montélimar (TGV depuis Paris 2h40). Navette à organiser (~45 min).",
  },
  {
    icon: Plane,
    title: "En avion",
    desc: "Aéroport Lyon-Saint Exupéry (~2h) ou Marseille-Provence (~2h30).",
  },
];

export default function VenueSection() {
  return (
    <section id="lieu" className="section-padding bg-white-warm">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="font-ui mb-4 text-gold tracking-[0.3em]">Le Lieu</p>
          <h2 className="font-heading mb-6 text-4xl text-navy md:text-6xl">
            Château de{" "}
            <span className="font-display text-gold">Chaussy</span>
          </h2>
          <div className="gold-line-wide" />
          <p className="mx-auto mt-6 max-w-2xl text-charcoal/80">
            Bâtisse du XII<sup>e</sup> siècle nichée au coeur de l&apos;Ardèche
            méridionale, le Château de Chaussy allie depuis plus de 35 ans
            le charme des pierres de pays et le confort moderne. Un domaine
            de 5 hectares privatisé pour le week-end, entre les Gorges de
            l&apos;Ardèche et les champs de lavande du sud.
          </p>
        </ScrollReveal>

        {/* Full-width hero image of the château */}
        <ScrollReveal className="mb-16">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="ornate-border">
              <div className="relative aspect-[21/9] overflow-hidden rounded-lg">
                <Image
                  src="/images/chateau.jpeg"
                  alt="Vue aérienne du Château de Chaussy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-lg text-cream/90 drop-shadow-lg md:text-xl">
                    Un domaine du XII<sup>e</sup> siècle privatisé pour notre week-end
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Two-image row */}
        <div className="mb-16 grid gap-4 md:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/images/entree-nuit.jpg"
                alt="Entrée du château de nuit"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-ui text-xs text-cream/90 tracking-[0.2em]">
                  L&apos;arche du château
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/images/principale.jpg"
                alt="Le château avec sa piscine"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-ui text-xs text-cream/90 tracking-[0.2em]">
                  La piscine & le château
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Heritage & Region Highlights */}
        <ScrollReveal className="mb-16">
          <div className="rounded-2xl border border-gold/15 bg-cream p-8 md:p-10">
            <div className="mb-6 text-center">
              <p className="font-ui mb-2 text-gold tracking-[0.3em]">
                Un écrin d&apos;exception
              </p>
              <h3 className="font-heading text-2xl text-navy md:text-3xl">
                Le domaine & sa région
              </h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <History className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h4 className="font-heading text-base text-navy">
                    Patrimoine du XII<sup>e</sup> siècle
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/80">
                    Pierres de pays, cheminées anciennes et lustres en pampilles de cristal. La Salle d&apos;Époque de 75m² et sa voûte en pierres témoignent de huit siècles d&apos;histoire.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mountain className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h4 className="font-heading text-base text-navy">
                    Gorges de l&apos;Ardèche
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/80">
                    À quelques minutes du Pont d&apos;Arc et de la Grotte Chauvet, classée au patrimoine mondial de l&apos;UNESCO. Un cadre naturel spectaculaire pour vos photos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Grape className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h4 className="font-heading text-base text-navy">
                    Terroir & Douceur du sud
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/80">
                    Lavande, vignobles et oliviers en Ardèche méridionale. Un climat privilégié baigné de soleil pour un week-end sous le signe de la Provence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main content grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Features */}
          <div className="space-y-8">
            {/* Features grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {features.map((feature, i) => (
                <ScrollReveal key={feature.title} delay={0.08 * i} direction="up">
                  <div className="rounded-lg border border-gold/10 bg-cream p-4 text-center transition-all duration-300 hover:border-gold/30 hover:shadow-lg">
                    <feature.icon className="mx-auto mb-2 h-5 w-5 text-gold" />
                    <h4 className="font-heading text-sm text-navy">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/75">
                      {feature.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Website link */}
            <ScrollReveal delay={0.4}>
              <a
                href="https://www.chateau-de-chaussy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-lg border border-gold/20 p-3 transition-all hover:border-gold/40 hover:bg-cream"
              >
                <span className="font-ui text-xs text-navy">
                  Découvrir le domaine
                </span>
                <ExternalLink className="h-3 w-3 text-gold transition-transform group-hover:translate-x-0.5" />
              </a>
            </ScrollReveal>
          </div>

          {/* Right: Map + Access */}
          <div className="space-y-8">
            {/* Map */}
            <ScrollReveal direction="right">
              <div className="aspect-[4/3] overflow-hidden rounded-lg border border-gold/10 shadow-lg">
                <MapComponent />
              </div>
            </ScrollReveal>

            {/* Address */}
            <ScrollReveal delay={0.2}>
              <div className="flex items-start gap-3 rounded-lg bg-cream p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h4 className="font-heading text-base text-navy">Adresse</h4>
                  <p className="mt-1 text-base text-charcoal/80">
                    Château de Chaussy
                    <br />
                    64 Avenue de Vallon
                    <br />
                    07120 Ruoms, Ardèche
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Access info */}
            <div className="space-y-3">
              {access.map((item, i) => (
                <ScrollReveal key={item.title} delay={0.3 + i * 0.1}>
                  <div className="flex items-start gap-3 rounded-lg border border-gold/5 p-4 transition-colors hover:bg-cream/50">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                    <div>
                      <h4 className="font-ui text-xs text-navy">{item.title}</h4>
                      <p className="mt-0.5 text-base text-charcoal/75">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
