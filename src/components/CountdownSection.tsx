"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const WEDDING_DATE = new Date("2027-09-04T14:30:00");

interface TimeUnit {
  value: number;
  label: string;
}

function getTimeRemaining(): TimeUnit[] {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return [
      { value: 0, label: "Jours" },
      { value: 0, label: "Heures" },
      { value: 0, label: "Minutes" },
      { value: 0, label: "Secondes" },
    ];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return [
    { value: days, label: "Jours" },
    { value: hours, label: "Heures" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Secondes" },
  ];
}

function CountdownCard({ value, label }: TimeUnit) {
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-gold/20 bg-cream shadow-sm sm:h-24 sm:w-24 md:h-28 md:w-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-heading relative text-3xl text-navy sm:text-4xl md:text-5xl"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="font-ui mt-3 text-xs text-cream/80 tracking-[0.2em]">
        {label}
      </span>
    </motion.div>
  );
}

export default function CountdownSection() {
  const [time, setTime] = useState<TimeUnit[]>(getTimeRemaining());
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <section ref={sectionRef} className="section-padding relative overflow-hidden">
        <motion.div className="absolute inset-[-10%]" style={{ y: bgY }}>
          <Image
            src="/images/entree-nuit.jpg"
            alt="Château de nuit"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-20 w-20 items-center justify-center rounded-lg border border-gold/20 bg-cream/5 sm:h-24 sm:w-24 md:h-28 md:w-28"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Parallax background image */}
      <motion.div className="absolute inset-[-10%]" style={{ y: bgY }}>
        <Image
          src="/images/entree-nuit.jpg"
          alt="Château de nuit"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/75" />
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(201,169,110,0.4) 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <p className="font-ui mb-4 text-gold/80 tracking-[0.3em]">
            Compte à Rebours
          </p>
          <h2 className="font-heading mb-4 text-4xl text-cream md:text-6xl">
            Le jour{" "}
            <span className="font-display text-gold">approche</span>
          </h2>
          <div className="gold-line-wide mb-12" />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {time.map((unit) => (
              <CountdownCard key={unit.label} {...unit} />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <p className="font-display mt-12 text-xl text-cream/80">
            4 Septembre 2027 &middot; 14h30
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
