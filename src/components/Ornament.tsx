"use client";

import { motion } from "framer-motion";
import { AQUARELLES } from "@/data/aquarelles";

interface OrnamentProps {
  className?: string;
  /** Id d'aquarelle à utiliser comme motif central. Défaut : dahlia. */
  motifId?: string;
}

export default function Ornament({ className = "", motifId = "dahlia" }: OrnamentProps) {
  const motif = AQUARELLES.find((a) => a.id === motifId) ?? AQUARELLES[0];
  const ratio = motif.height / motif.width;
  const size = 44;

  return (
    <motion.div
      className={`flex items-center justify-center gap-4 py-12 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
    >
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-terracotta)]/40 md:w-28" />
      <img
        src={motif.src}
        srcSet={motif.srcSet}
        sizes={`${size}px`}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
        decoding="async"
        style={{
          width: size,
          height: size * ratio,
          objectFit: "contain",
          userSelect: "none",
        }}
      />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-terracotta)]/40 md:w-28" />
    </motion.div>
  );
}
