"use client";

/**
 * <WatercolorScatter />
 *
 * Dispose des aquarelles peintes à la main en "aléatoire maîtrisé" autour
 * d'une section. Placement déterministe (seed fixe), parallaxe douce au
 * scroll, dérive lente pour les insectes, zones sûres pour ne jamais passer
 * derrière un bloc de texte dense.
 *
 * À placer dans un parent en `position: relative` :
 *
 *   <section className="relative ...">
 *     <WatercolorScatter density={2} types={["insecte"]} zone="edges" seed={3} />
 *     ...contenu...
 *   </section>
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  AQUARELLES,
  type Aquarelle,
  type AquarelleType,
} from "@/data/aquarelles";

type Zone = "corners" | "edges" | "bottom" | "top" | "scatter";

interface Props {
  /** Nombre d'éléments rendus sur desktop. */
  density?: number;
  /** Nombre d'éléments rendus sur mobile (<= 768px). */
  mobileDensity?: number;
  /** Restreint aux types listés. Si non fourni : tout est éligible. */
  types?: AquarelleType[];
  /** Zone de placement (toujours hors de l'axe central pour les "edges"). */
  zone?: Zone;
  /** Seed pour le RNG déterministe — change-le entre sections. */
  seed?: number;
  /** Utilise la version "fantôme" (désaturée + 20% d'opacité). */
  ghost?: boolean;
  /** Tailles min/max en px (largeur). */
  minSize?: number;
  maxSize?: number;
  /** Active le parallax au scroll. */
  parallax?: boolean;
  /** Multiplicateur d'opacité globale (0–1). */
  opacityScale?: number;
  className?: string;
}

/* Générateur pseudo-aléatoire déterministe (Mulberry32). */
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickPosition(rng: () => number, zone: Zone): { left: number; top: number } {
  switch (zone) {
    case "corners": {
      const c = Math.floor(rng() * 4);
      const xs: [number, number][] = [[0, 16], [84, 100], [0, 16], [84, 100]];
      const ys: [number, number][] = [[0, 16], [0, 16], [84, 100], [84, 100]];
      const [x0, x1] = xs[c];
      const [y0, y1] = ys[c];
      return { left: x0 + rng() * (x1 - x0), top: y0 + rng() * (y1 - y0) };
    }
    case "edges": {
      const e = Math.floor(rng() * 4);
      if (e === 0) return { left: rng() * 100, top: rng() * 14 };
      if (e === 1) return { left: rng() * 100, top: 86 + rng() * 14 };
      if (e === 2) return { left: rng() * 12, top: 12 + rng() * 76 };
      return { left: 88 + rng() * 12, top: 12 + rng() * 76 };
    }
    case "bottom":
      return { left: rng() * 100, top: 65 + rng() * 35 };
    case "top":
      return { left: rng() * 100, top: rng() * 22 };
    case "scatter":
    default: {
      let l = rng() * 100;
      let t = rng() * 100;
      // Repousse hors du carré central pour ne pas masquer le texte.
      if (l > 28 && l < 72 && t > 28 && t < 72) {
        l = l < 50 ? rng() * 18 : 82 + rng() * 18;
      }
      return { left: l, top: t };
    }
  }
}

interface ItemSpec {
  aq: Aquarelle;
  left: number;
  top: number;
  size: number;
  rotation: number;
  opacity: number;
  depth: number;
  drift: boolean;
  key: string;
}

export default function WatercolorScatter({
  density = 3,
  mobileDensity = 1,
  types,
  zone = "edges",
  seed = 1,
  ghost = false,
  minSize = 90,
  maxSize = 200,
  parallax = true,
  opacityScale = 1,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Détection mobile + montage côté client (évite mismatch SSR/CSR).
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const items = useMemo<ItemSpec[]>(() => {
    const n = isMobile ? mobileDensity : density;
    if (n <= 0) return [];
    const rngSeed = seed * 9301 + n * 49297 + (types?.join("|").length ?? 0);
    const rng = mulberry32(rngSeed);
    const pool = types ? AQUARELLES.filter((a) => types.includes(a.type)) : AQUARELLES;
    if (pool.length === 0) return [];
    return Array.from({ length: n }, (_, i) => {
      const aq = pool[Math.floor(rng() * pool.length)];
      const { left, top } = pickPosition(rng, zone);
      const size = minSize + rng() * (maxSize - minSize);
      const rotation = -8 + rng() * 16;
      const opacity = (ghost ? 0.85 : 0.85 + rng() * 0.15) * opacityScale;
      const depth = 0.25 + rng() * 0.75; // 0.25..1 — profondeur parallaxe
      const drift = aq.type === "insecte";
      return {
        aq,
        left,
        top,
        size,
        rotation,
        opacity,
        depth,
        drift,
        key: `${seed}-${i}-${aq.id}`,
      };
    });
  }, [
    density,
    mobileDensity,
    isMobile,
    types,
    zone,
    seed,
    minSize,
    maxSize,
    ghost,
    opacityScale,
  ]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {mounted && items.map((it) => (
        <ScatterItem
          key={it.key}
          item={it}
          scrollYProgress={scrollYProgress}
          parallax={parallax && !reducedMotion}
          driftEnabled={false}
          ghost={ghost}
        />
      ))}
    </div>
  );
}

/* Un seul élément — isolé pour pouvoir appeler useTransform par item. */
function ScatterItem({
  item,
  scrollYProgress,
  parallax,
  driftEnabled,
  ghost,
}: {
  item: ItemSpec;
  scrollYProgress: MotionValue<number>;
  parallax: boolean;
  driftEnabled: boolean;
  ghost: boolean;
}) {
  // Plus la profondeur est grande, plus l'élément bouge — donne l'effet de plans.
  const yRange = parallax ? 60 * item.depth : 0;
  const y = useTransform(scrollYProgress, [0, 1], [yRange, -yRange]);

  const src = ghost ? item.aq.srcGhost : item.aq.src;
  const srcSet = ghost ? item.aq.srcSetGhost : item.aq.srcSet;
  const ratio = item.aq.height / item.aq.width;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${item.left}%`,
        top: `${item.top}%`,
        width: item.size,
        height: item.size * ratio,
        opacity: item.opacity,
        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
        y,
        willChange: "transform",
      }}
      animate={
        driftEnabled
          ? {
              x: [0, 8, -6, 4, 0],
              y: [0, -10, 6, -4, 0],
              rotate: [
                item.rotation,
                item.rotation + 2,
                item.rotation - 2,
                item.rotation + 1,
                item.rotation,
              ],
            }
          : undefined
      }
      transition={
        driftEnabled
          ? {
              duration: 14 + (item.depth * 8),
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={`${Math.round(item.size)}px`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ width: "100%", height: "100%", userSelect: "none" }}
      />
    </motion.div>
  );
}
