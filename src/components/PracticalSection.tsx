"use client";

import {
  Shirt,
  Gift,
  Baby,
  ParkingCircle,
  Sun,
  Clock,
  HelpCircle,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    icon: Shirt,
    question: "Dress code",
    answer:
      "Tenue de cocktail chic. Mesdames, privilégiez des chaussures adaptées à l'herbe pour la cérémonie en plein air. Messieurs, un costume sera parfait.",
  },
  {
    icon: Gift,
    question: "Liste de mariage",
    answer:
      "Votre présence est notre plus beau cadeau. Si toutefois vous souhaitez contribuer, une urne sera à disposition le jour J.",
  },
  {
    icon: Baby,
    question: "Les enfants sont-ils les bienvenus ?",
    answer:
      "Absolument ! Le domaine dispose d'une aire de jeux, d'une mini ferme et d'une pataugeoire pour les plus petits. Un espace dédié sera aménagé.",
  },
  {
    icon: ParkingCircle,
    question: "Stationnement",
    answer:
      "Un parking privé est à votre disposition au sein du domaine. Pas de stress, vous êtes chez vous !",
  },
  {
    icon: Sun,
    question: "Hébergement sur place",
    answer:
      "Le domaine dispose de 21 gîtes en pierres de pays (de 2 à 12 pers.), avec terrasse privative, cuisine équipée et climatisation. 135 couchages au total. Indiquez-le dans le RSVP !",
  },
  {
    icon: Clock,
    question: "Horaires du week-end",
    answer:
      "Le domaine est entièrement privatisé pour nous ! Arrivée possible dès le vendredi 3 septembre à 16h. Départ le dimanche 5 septembre à 18h. Profitez de la piscine, du parc et du brunch du dimanche !",
  },
  {
    icon: Camera,
    question: "Photos & Réseaux sociaux",
    answer:
      "Partagez vos plus beaux clichés avec le hashtag #ClemenceEtDorian. Un photographe professionnel sera présent, mais vos photos spontanées sont précieuses !",
  },
];

export default function PracticalSection() {
  return (
    <section id="infos" className="section-padding bg-cream relative overflow-hidden paper-grain">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center md:mb-20">
          <p className="font-ui mb-4 text-gold tracking-[0.3em]">
            Infos Pratiques
          </p>
          <h2 className="font-heading mb-6 text-4xl text-navy md:text-6xl">
            Tout ce qu&apos;il faut{" "}
            <span className="font-display text-gold">savoir</span>
          </h2>
          <div className="gold-line-wide" />
        </ScrollReveal>

        {/* Hashtag Banner */}
        <ScrollReveal delay={0.1} className="mb-12">
          <div className="rounded-xl border border-gold/20 bg-white-warm p-6 text-center md:p-8">
            <Camera className="mx-auto mb-3 h-6 w-6 text-gold" />
            <p className="font-heading text-xl text-navy md:text-2xl">
              #ClemenceEtDorian
            </p>
            <p className="mt-2 text-sm text-charcoal/75">
              Notre hashtag officiel pour partager vos photos du week-end
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.question} delay={i * 0.08} direction="up">
              <motion.div
                className="group h-full rounded-xl border border-gold/10 bg-white-warm p-6 transition-all duration-300 hover:border-gold/25 hover:shadow-md"
                whileHover={{ y: -2 }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
                    <faq.icon className="h-4 w-4 text-gold" />
                  </div>
                  <h3 className="font-heading text-base text-navy">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-charcoal/80">
                  {faq.answer}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Contact hint */}
        <ScrollReveal delay={0.5} className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-charcoal/70">
            <HelpCircle className="h-4 w-4" />
            <p>
              D&apos;autres questions ? N&apos;hésitez pas à nous contacter directement.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
