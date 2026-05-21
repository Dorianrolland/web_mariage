"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import WatercolorScatter from "./WatercolorScatter";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen min-h-[700px] items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/images/cours.jpeg"
          alt="Cour d'Honneur du Château de Chaussy"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            opacity,
            background:
              "linear-gradient(to bottom, rgba(58,34,24,0.55) 0%, rgba(58,34,24,0.25) 40%, rgba(58,34,24,0.5) 100%)",
          }}
        />
        {/* Vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(58,34,24,0.4) 100%)",
          }}
        />

        {/* Animated golden light particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { x: 12, y: 8 }, { x: 85, y: 23 }, { x: 45, y: 67 }, { x: 72, y: 42 },
            { x: 28, y: 89 }, { x: 93, y: 15 }, { x: 57, y: 55 }, { x: 8, y: 73 },
            { x: 38, y: 31 }, { x: 67, y: 92 }, { x: 19, y: 48 }, { x: 81, y: 63 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gold/40"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 2, 0],
                y: [0, -120],
              }}
              transition={{
                duration: 5 + (i % 4),
                repeat: Infinity,
                delay: (i * 0.9) % 6,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Aquarelles : insectes qui dérivent très subtilement (préserve la photo) */}
      <WatercolorScatter
        density={2}
        mobileDensity={1}
        types={["insecte"]}
        zone="edges"
        seed={11}
        minSize={70}
        maxSize={120}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
        style={{ y: textY, opacity }}
      >
        {/* Top ornament line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 120 }}
          transition={{ duration: 1.5, delay: 3.5 }}
          className="h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        />

        {/* Invitation text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.8 }}
          className="font-ui tracking-[0.4em] text-cream/80"
        >
          Nous avons la joie de vous inviter au mariage de
        </motion.p>

        {/* Names - letter by letter reveal */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 4.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-6xl text-cream sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Clémence
          </motion.h1>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 4.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-display text-4xl text-gold md:text-5xl"
        >
          &
        </motion.span>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 5.0, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-6xl text-cream sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Dorian
          </motion.h1>
        </div>

        {/* Date & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 5.6 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1.2, delay: 5.8 }}
            className="h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <p
            className="text-xl tracking-[0.15em] text-cream/90 md:text-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            4 Septembre 2027
          </p>
          <p className="font-ui text-stone-light/80 tracking-[0.25em]">
            Château de Chaussy &middot; Ardèche
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.5, duration: 1 }}
      >
        <span className="font-ui text-cream/70 text-xs tracking-[0.3em]">
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-gold/60" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
