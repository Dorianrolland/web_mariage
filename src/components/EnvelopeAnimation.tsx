"use client";

import { useState, useCallback, useEffect } from "react";
import {
  motion,
  useAnimate,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import confetti from "canvas-confetti";

// ─── Types ───────────────────────────────────────────────────────────
type Stage = "entering" | "idle" | "animating" | "done";

// ─── Confetti helpers ────────────────────────────────────────────────
function burstSeal(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const x = (r.left + r.width / 2) / window.innerWidth;
  const y = (r.top + r.height / 2) / window.innerHeight;
  confetti({ particleCount: 40, spread: 60, origin: { x, y }, colors: ["#c9a96e", "#b8860b", "#daa520", "#8b6914"], scalar: 0.65, gravity: 1.6, ticks: 90, shapes: ["circle"], disableForReducedMotion: true });
  confetti({ particleCount: 18, spread: 100, origin: { x, y }, colors: ["#daa520", "#f5e6c8"], scalar: 0.3, gravity: 0.5, ticks: 140, shapes: ["circle"], disableForReducedMotion: true });
}

function celebrate() {
  const end = Date.now() + 1800;
  (function f() {
    confetti({ particleCount: 2, angle: 60, spread: 50, origin: { x: 0, y: 0.55 }, colors: ["#c9a96e", "#daa520", "#ffd700", "#C4918A"], disableForReducedMotion: true });
    confetti({ particleCount: 2, angle: 120, spread: 50, origin: { x: 1, y: 0.55 }, colors: ["#c9a96e", "#daa520", "#ffd700", "#C4918A"], disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(f);
  })();
}

// ─── Wax Seal ────────────────────────────────────────────────────────
function Seal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="s1" cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#ecd05a" />
          <stop offset="30%" stopColor="#c9a03a" />
          <stop offset="65%" stopColor="#a07928" />
          <stop offset="100%" stopColor="#6e5118" />
        </radialGradient>
        <radialGradient id="s2" cx="30%" cy="26%" r="38%">
          <stop offset="0%" stopColor="#fffbe8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fffbe8" stopOpacity="0" />
        </radialGradient>
        <filter id="sd"><feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#4a3210" floodOpacity="0.5" /></filter>
      </defs>
      <path d="M50 3C56 8,62 5,67 10C72 14,78 11,82 18C86 24,92 22,93 31C94 39,98 43,96 50C94 58,98 62,93 69C88 75,90 82,84 86C78 90,74 94,67 93C60 92,56 97,50 97C44 97,40 92,33 93C26 94,22 90,16 86C10 82,12 76,7 69C2 62,6 58,4 50C2 42,6 38,7 31C8 22,14 24,18 18C22 11,28 14,33 10C38 5,44 8,50 3Z" fill="url(#s1)" filter="url(#sd)" />
      <path d="M50 3C56 8,62 5,67 10C72 14,78 11,82 18C86 24,92 22,93 31C94 39,98 43,96 50C94 58,98 62,93 69C88 75,90 82,84 86C78 90,74 94,67 93C60 92,56 97,50 97C44 97,40 92,33 93C26 94,22 90,16 86C10 82,12 76,7 69C2 62,6 58,4 50C2 42,6 38,7 31C8 22,14 24,18 18C22 11,28 14,33 10C38 5,44 8,50 3Z" fill="url(#s2)" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#b8940f" strokeWidth="0.7" opacity="0.3" />
      <circle cx="50" cy="50" r="26.5" fill="none" stroke="#d4b44a" strokeWidth="0.4" opacity="0.2" />
      <text x="50" y="45" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="12.5" fill="#f5e6c8" opacity="0.85" letterSpacing="1.5">C &amp; D</text>
      <text x="50" y="60" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="8" fill="#f5e6c8" opacity="0.5" letterSpacing="0.8">04.09.27</text>
    </svg>
  );
}

// ─── Damask SVG ──────────────────────────────────────────────────────
const DAMASK = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2C23 8,28 10,34 8C30 14,30 18,34 24C28 22,23 24,20 30C17 24,12 22,6 24C10 18,10 14,6 8C12 10,17 8,20 2Z' fill='%23c9a96e' fill-opacity='0.08'/%3E%3C/svg%3E")`;

// ─── Component ───────────────────────────────────────────────────────
export default function EnvelopeAnimation() {
  const [stage, setStage] = useState<Stage>("entering");
  const [scope, animate] = useAnimate();

  // Mouse parallax
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useTransform(mx, [0, 1], [-6, 6]);
  const rotateX = useTransform(my, [0, 1], [5, -5]);

  // Lock body scroll & ensure scroll=0
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Entrance
  useEffect(() => {
    const t = setTimeout(() => setStage("idle"), 150);
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking
  useEffect(() => {
    if (stage !== "idle") return;
    const handler = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [stage, mx, my]);

  const run = useCallback(async (sealEl: HTMLElement) => {
    setStage("animating");
    mx.set(0.5);
    my.set(0.5);

    // Recuperer tous les elements une seule fois
    const flapEl = document.getElementById("flap");
    const cardEl = document.getElementById("card");
    const overlayEl = document.getElementById("overlay");

    burstSeal(sealEl);

    // 1 — Sceau eclate (bien visible)
    await animate(sealEl,
      { scale: [1, 1.2, 0], opacity: [1, 0.9, 0], rotate: [0, 10, -20] },
      { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    );

    // petite respiration
    await new Promise(r => setTimeout(r, 150));

    // 2 — Volet s'ouvre en 3D (lent et elegant)
    if (flapEl) {
      await animate(flapEl,
        { rotateX: 180 },
        { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      );
    }

    // 3 — Carte monte hors de l'enveloppe (spring doux)
    if (cardEl) {
      cardEl.style.zIndex = "50";
      await animate(cardEl,
        { y: "-70%" },
        { type: "spring", stiffness: 40, damping: 13, mass: 1.1 }
      );
    }

    // 4 — Pause pour admirer le faire-part + confetti
    await new Promise(r => setTimeout(r, 800));
    celebrate();
    await new Promise(r => setTimeout(r, 500));

    // 5 — Lever de rideau : tout l'overlay glisse vers le haut
    if (overlayEl) {
      overlayEl.style.willChange = "transform";
      overlayEl.style.pointerEvents = "none";
      await animate(overlayEl,
        { y: "-100vh" },
        { duration: 0.9, ease: [0.65, 0, 0.35, 1] }
      );
    }

    // 6 — Nettoyage
    window.scrollTo(0, 0);
    document.body.style.overflow = "";
    setStage("done");
  }, [animate, mx, my]);

  const onClick = useCallback(() => {
    if (stage !== "idle") return;
    const sealEl = document.getElementById("seal");
    if (sealEl) run(sealEl);
  }, [stage, run]);

  // Once done, unmount
  if (stage === "done") return null;

  const idle = stage === "idle";

  return (
    <div ref={scope}>
      <div
        id="overlay"
        className="fixed inset-0 z-[9999]"
        style={{ background: "#000000" }}
      >
        {/* Warm radial glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(201,169,110,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: DAMASK, backgroundSize: "60px 60px", pointerEvents: "none" }} />

        {/* Envelope with parallax */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "800px" }}>
          <motion.div
            id="envelope"
            onClick={onClick}
            className="relative w-[86vw] max-w-[640px] cursor-pointer"
            style={{
              aspectRatio: "3 / 2",
              rotateX: idle ? rotateX : 0,
              rotateY: idle ? rotateY : 0,
              transformStyle: "preserve-3d",
            }}
            initial={{ scale: 0.9, opacity: 0, y: 25 }}
            animate={idle ? { scale: 1, opacity: 1, y: 0 } : stage === "entering" ? { scale: 0.9, opacity: 0, y: 25 } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ─── Shadow layer (separate for depth) ─── */}
            <div className="absolute -inset-2 -z-10 rounded-3xl" style={{ boxShadow: "0 8px 30px rgba(120,95,50,0.12), 0 30px 60px rgba(100,80,40,0.08)" }} />

            {/* ─── Envelope body ─── */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(175deg, #f2e8d2 0%, #e9dcbe 35%, #e0d0a8 65%, #d6c494 100%)" }}>
              {/* Paper texture */}
              <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")` }} />
              {/* Inner border */}
              <div className="absolute inset-[3.5%] rounded-xl border border-gold/[0.12]" />
            </div>

            {/* ─── Bottom flap ─── */}
            <div className="absolute inset-x-0 bottom-0 z-[12] rounded-b-2xl overflow-hidden" style={{ height: "52%", clipPath: "polygon(0 100%, 50% 8%, 100% 100%)", background: "linear-gradient(0deg, #d8c290 0%, #ddc99a 60%, #e2d0a4 100%)", pointerEvents: "none" }}>
              <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f2)'/%3E%3C/svg%3E")` }} />
            </div>

            {/* ─── Left flap ─── */}
            <div className="absolute inset-y-0 left-0 z-[11]" style={{ width: "37%", clipPath: "polygon(0 0, 100% 50%, 0 100%)", background: "linear-gradient(120deg, #e4d2a8, #d9c594)", pointerEvents: "none" }} />

            {/* ─── Right flap ─── */}
            <div className="absolute inset-y-0 right-0 z-[11]" style={{ width: "37%", clipPath: "polygon(100% 0, 0 50%, 100% 100%)", background: "linear-gradient(240deg, #e4d2a8, #d9c594)", pointerEvents: "none" }} />

            {/* ─── Card (mostly hidden, bottom peeks out) ─── */}
            <div
              id="card"
              className="absolute inset-x-[4.5%] bottom-[5%] z-[13] overflow-hidden rounded-xl"
              style={{
                top: "12%",
                background: "linear-gradient(180deg, #FEFCF9 0%, #FAF7F2 100%)",
                boxShadow: "0 1px 6px rgba(80,60,30,0.06)",
                pointerEvents: "none",
              }}
            >
              {/* Card content — bottom-aligned so it shows below the flap */}
              <div className="flex h-full flex-col items-center justify-end gap-1.5 pb-[8%] md:gap-2.5 md:pb-[7%]">
                <div className="gold-line" />
                <p className="font-ui text-[8px] tracking-[0.3em] text-charcoal/35 md:text-[10px]">
                  Vous êtes conviés au mariage de
                </p>
                <p className="font-heading text-xl text-dark md:text-2xl lg:text-3xl">
                  Clémence &amp; Dorian
                </p>
                <div className="gold-line" />
                <p className="font-elegant text-[9px] tracking-[0.12em] text-stone-dark/40 md:text-xs">
                  Château de Chaussy · 4 Septembre 2027
                </p>
              </div>
            </div>

            {/* ─── Top flap (3D) ─── */}
            <div
              id="flap"
              className="absolute inset-x-0 top-0 z-[20]"
              style={{ height: "56%", transformOrigin: "top center", transformStyle: "preserve-3d", pointerEvents: "none" }}
            >
              {/* Front */}
              <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 50% 84%, 100% 0)", background: "linear-gradient(180deg, #ebd9b2 0%, #dece9e 60%, #d4c28e 100%)", backfaceVisibility: "hidden" }}>
                {/* Fold shadow at the crease */}
                <div className="absolute inset-x-[5%] bottom-0 h-[25%]" style={{ background: "linear-gradient(to top, rgba(170,145,90,0.07), transparent)" }} />
              </div>
              {/* Back — liner with damask */}
              <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 50% 84%, 100% 0)", background: "#e2cea0", backgroundImage: DAMASK, backgroundSize: "36px 36px", backfaceVisibility: "hidden", transform: "rotateX(180deg)" }} />
            </div>

            {/* ─── Wax seal — at flap tip ─── */}
            <div
              id="seal"
              className="absolute left-1/2 z-[30]"
              style={{ top: "45%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}
            >
              <motion.div
                className="rounded-full"
                animate={idle ? { boxShadow: ["0 0 0 0px rgba(201,169,110,0)", "0 0 15px 4px rgba(201,169,110,0.22)", "0 0 0 0px rgba(201,169,110,0)"] } : undefined}
                transition={idle ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : undefined}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.93 }}
              >
                <Seal className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16" />
              </motion.div>
            </div>

            {/* ─── Hint ─── */}
            <AnimatePresence>
              {idle && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: [0.2, 0.55, 0.2], y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }, y: { duration: 0.3 } }}
                  className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-xs tracking-[0.15em] text-charcoal/30 md:-bottom-11 md:text-sm"
                >
                  Touchez le sceau pour ouvrir
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
