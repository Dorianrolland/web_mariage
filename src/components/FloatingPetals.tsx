"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  rotation: number;
  drift: number;
  color: string;
}

const COLORS = [
  "rgba(196,145,138,0.35)", // rose
  "rgba(212,168,163,0.3)",  // rose-light
  "rgba(201,169,110,0.2)",  // gold
  "rgba(232,213,176,0.2)",  // gold-light
  "rgba(196,145,138,0.25)", // rose muted
];

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 12 + Math.random() * 10,
    size: 8 + Math.random() * 14,
    opacity: 0.3 + Math.random() * 0.4,
    rotation: Math.random() * 360,
    drift: -30 + Math.random() * 60,
    color: COLORS[i % COLORS.length],
  }));
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(generatePetals(15));
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: "-20px",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, petal.drift, -petal.drift / 2, petal.drift * 0.8],
            rotate: [petal.rotation, petal.rotation + 360 + Math.random() * 180],
            opacity: [0, petal.opacity, petal.opacity, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Petal shape using SVG */}
          <svg
            width={petal.size}
            height={petal.size * 1.4}
            viewBox="0 0 20 28"
            fill="none"
          >
            <path
              d="M10 0 C14 4, 20 10, 18 18 C16 24, 12 28, 10 28 C8 28, 4 24, 2 18 C0 10, 6 4, 10 0Z"
              fill={petal.color}
            />
            {/* Vein detail */}
            <path
              d="M10 2 C10 8, 10 16, 10 26"
              stroke={petal.color}
              strokeWidth="0.3"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
