"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useAnimate,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import confetti from "canvas-confetti";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
type Stage = "intro" | "sealed" | "animating" | "done";

/* ═══════════════════════════════════════════
   Confetti helpers
   ═══════════════════════════════════════════ */
function fireSealBurst(x: number, y: number) {
  const ox = x / window.innerWidth;
  const oy = y / window.innerHeight;
  confetti({
    particleCount: 45,
    startVelocity: 22,
    spread: 360,
    origin: { x: ox, y: oy },
    colors: ["#C9A96E", "#D4B87A", "#A8894D", "#C4918A"],
    ticks: 120,
    gravity: 0.7,
    scalar: 0.8,
    shapes: ["circle"],
    disableForReducedMotion: true,
  });
}

function fireGoldConfetti() {
  const colors = ["#C9A96E", "#D4B87A", "#A8894D", "#E8D5B0", "#C4918A"];
  const end = Date.now() + 1800;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ["circle", "square"],
      drift: 0.5,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ["circle", "square"],
      drift: -0.5,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/* ═══════════════════════════════════════════
   Petal SVG shape
   ═══════════════════════════════════════════ */
const PETAL_COLORS = [
  "#C4918A",
  "#D4A9A3",
  "#E8C8C0",
  "#C9A96E",
  "#D4B87A",
  "#DEB8AF",
];

function PetalPath({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%">
      <path
        d="M10 0 Q16 5 14 12 Q12 18 10 20 Q8 18 6 12 Q4 5 10 0Z"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M10 2 Q14 6 12 11 Q11 15 10 17 Q9 15 8 11 Q6 6 10 2Z"
        fill={color}
        opacity="0.4"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Wax Seal (pre-computed static SVG)
   ═══════════════════════════════════════════ */
const SEAL_PATH =
  "M 84.48 44.00 Q 78.03 48.48 83.10 54.48 Q 75.71 57.13 79.06 64.24 Q 71.23 64.89 72.62 72.62 Q 64.89 71.23 64.24 79.06 Q 57.13 75.71 54.48 83.10 Q 48.48 78.03 44.00 84.48 Q 39.52 78.03 33.52 83.10 Q 30.87 75.71 23.76 79.06 Q 23.11 71.23 15.38 72.62 Q 16.77 64.89 8.94 64.24 Q 12.29 57.13 4.90 54.48 Q 9.97 48.48 3.52 44.00 Q 9.97 39.52 4.90 33.52 Q 12.29 30.87 8.94 23.76 Q 16.77 23.11 15.38 15.38 Q 23.11 16.77 23.76 8.94 Q 30.87 12.29 33.52 4.90 Q 39.52 9.97 44.00 3.52 Q 48.48 9.97 54.48 4.90 Q 57.13 12.29 64.24 8.94 Q 64.89 16.77 72.62 15.38 Q 71.23 23.11 79.06 23.76 Q 75.71 30.87 83.10 33.52 Q 78.03 39.52 84.48 44.00 Z";

const SEAL_DOTS = [
  [73.48, 44], [71.24, 55.28], [64.85, 64.85], [55.28, 71.24],
  [44, 73.48], [32.72, 71.24], [23.15, 64.85], [16.76, 55.28],
  [14.52, 44], [16.76, 32.72], [23.15, 23.15], [32.72, 16.76],
  [44, 14.52], [55.28, 16.76], [64.85, 23.15], [71.24, 32.72],
];

function WaxSeal() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <defs>
        <radialGradient id="sealGrad" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#E8D5B0" />
          <stop offset="25%" stopColor="#D4B87A" />
          <stop offset="55%" stopColor="#C9A96E" />
          <stop offset="80%" stopColor="#A8894D" />
          <stop offset="100%" stopColor="#8B6F3A" />
        </radialGradient>
        <radialGradient id="sealHi" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="sealShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(100,70,30,0.5)" />
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="rgba(80,55,20,0.25)" />
        </filter>
        <filter id="sealTex">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" />
        </filter>
      </defs>
      <path d={SEAL_PATH} fill="url(#sealGrad)" filter="url(#sealShadow)" />
      <path d={SEAL_PATH} fill="url(#sealGrad)" filter="url(#sealTex)" opacity="0.4" />
      <path d={SEAL_PATH} fill="url(#sealHi)" />
      <circle cx="44" cy="44" r="27.28" fill="none" stroke="rgba(139,111,58,0.5)" strokeWidth="1.2" />
      <circle cx="44" cy="44" r="24.2" fill="none" stroke="rgba(232,213,176,0.35)" strokeWidth="0.7" />
      <circle cx="44" cy="44" r="31.68" fill="none" stroke="rgba(139,111,58,0.3)" strokeWidth="0.5" />
      {SEAL_DOTS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.8" fill="rgba(232,213,176,0.4)" />
      ))}
      <text x="44" y="45" textAnchor="middle" dominantBaseline="central" fill="rgba(250,247,242,0.9)" fontSize="15" fontFamily="var(--font-serif)" fontWeight="600" letterSpacing="2" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
        C &amp; D
      </text>
      <text x="44" y="59" textAnchor="middle" dominantBaseline="central" fill="rgba(250,247,242,0.6)" fontSize="6.2" fontFamily="var(--font-sans)" letterSpacing="3">
        04.09.27
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Gold liner pattern (inside flap)
   ═══════════════════════════════════════════ */
function LinerPattern() {
  return (
    <svg width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <pattern id="damask" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="rgba(201,169,110,0.15)" />
          <circle cx="20" cy="20" r="8" fill="none" stroke="rgba(201,169,110,0.2)" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="4" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
          <circle cx="40" cy="0" r="4" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
          <circle cx="0" cy="40" r="4" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="4" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5" />
          <path d="M20 0 L40 20 L20 40 L0 20Z" fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#damask)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Filigree corner ornament
   ═══════════════════════════════════════════ */
function FiligreCorner({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 50 50" className={className} style={style}>
      <path d="M2 2 Q2 25 25 25 Q25 2 2 2Z" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4" />
      <path d="M5 5 Q5 22 22 22 Q22 5 5 5Z" fill="none" stroke="#C9A96E" strokeWidth="0.3" opacity="0.3" />
      <path d="M2 2 Q14 8 25 25" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.35" />
      <circle cx="8" cy="8" r="1.5" fill="#C9A96E" opacity="0.3" />
      <circle cx="14" cy="14" r="1" fill="#C9A96E" opacity="0.25" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Invitation card content (shared)
   ═══════════════════════════════════════════ */
function CardContent({ large }: { large?: boolean }) {
  const fs = large ? "min(40px, 9vw)" : "min(32px, 7vw)";
  const fsAmp = large ? "min(28px, 6vw)" : "min(22px, 5vw)";
  const fsDate = large ? "min(18px, 4vw)" : "min(16px, 3.5vw)";
  const fsLabel = large ? "min(12px, 3vw)" : "min(10px, 2.5vw)";
  const fsLoc = large ? "min(10px, 2.5vw)" : "min(9px, 2.2vw)";
  const lineW = large ? 50 : 40;
  const gap = large ? "mb-6" : "mb-5";
  const mt = large ? "mt-8" : "mt-5";

  return (
    <div className="relative text-center">
      <div className={`${gap} flex items-center justify-center gap-3`}>
        <div style={{ width: lineW, height: 1, background: "linear-gradient(90deg, transparent, #C9A96E)" }} />
        <svg width={large ? 16 : 12} height={large ? 16 : 12} viewBox="0 0 24 24" fill="#C9A96E" opacity="0.6">
          <path d="M12 2L12.9 8.1L18 4.9L14.8 10.1L20.9 11L14.8 11.9L18 17.1L12.9 13.9L12 20L11.1 13.9L6 17.1L9.2 11.9L3.1 11L9.2 10.1L6 4.9L11.1 8.1L12 2Z" />
        </svg>
        <div style={{ width: lineW, height: 1, background: "linear-gradient(90deg, #C9A96E, transparent)" }} />
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: fsLabel, color: "#C9A96E", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: large ? "min(20px, 4vw)" : "min(16px, 3.5vw)" }}>
        {large ? "Nous avons la joie de vous inviter" : "Vous êtes conviés au mariage de"}
      </p>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: fs, fontWeight: 700, color: "#3D3529", lineHeight: 1.2, marginBottom: 4 }}>Clémence</h2>
      <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: fsAmp, color: "#C9A96E", display: "block", margin: "4px 0" }}>&amp;</span>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: fs, fontWeight: 700, color: "#3D3529", lineHeight: 1.2, marginBottom: large ? "min(20px, 4vw)" : "min(16px, 3.5vw)" }}>Dorian</h2>
      <div className="mx-auto" style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #C9A96E, transparent)", marginBottom: large ? "min(16px, 3.5vw)" : "min(12px, 2.5vw)" }} />
      <p style={{ fontFamily: "var(--font-body)", fontSize: fsDate, color: "#3D3529", lineHeight: 1.6 }}>Samedi 4 Septembre 2027</p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: fsLoc, color: "rgba(61,53,41,0.55)", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 6 }}>
        Château de Chaussy &middot; Ardèche
      </p>
      {large && (
        <div className={`${mt} flex flex-col items-center gap-2`}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "min(9px, 2.2vw)", color: "rgba(61,53,41,0.4)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Découvrir
          </p>
          <motion.svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" strokeLinecap="round"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function IntroAnimation() {
  const [stage, setStage] = useState<Stage>("intro");
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const sealRef = useRef<HTMLDivElement>(null);

  /* ── Mouse parallax (sealed state only) ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  /* ── Lock scroll ── */
  useEffect(() => {
    if (stage !== "done") {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  /* ── Intro → sealed ── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (stage === "intro") setStage("sealed");
    }, 1800);
    return () => clearTimeout(t);
  }, [stage]);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (stage !== "sealed") return;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseX.set(cx - window.innerWidth / 2);
      mouseY.set(cy - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handler);
    window.addEventListener("touchmove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("touchmove", handler);
    };
  }, [stage, mouseX, mouseY]);

  /* ═══════════════════════════════════════════
     OPEN SEQUENCE (useAnimate imperative)
     ═══════════════════════════════════════════ */
  const handleOpen = useCallback(async () => {
    if (stage !== "sealed") return;
    setStage("animating");
    mouseX.set(0);
    mouseY.set(0);

    // Confetti burst at seal position
    if (sealRef.current) {
      const r = sealRef.current.getBoundingClientRect();
      fireSealBurst(r.left + r.width / 2, r.top + r.height / 2);
    }

    try {
      // 1 — Seal shatters
      await animate(
        "#seal",
        { scale: [1, 1.3, 0], opacity: [1, 0.8, 0], rotate: [0, 8, -15] },
        { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      );

      // 2 — Top flap opens (3D rotation)
      // Also lower the flap z-index so card can emerge above
      const flapEl = scope.current?.querySelector("#flap") as HTMLElement | null;
      if (flapEl) flapEl.style.zIndex = "1";
      await animate(
        "#flap",
        { rotateX: 180 },
        { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
      );

      // 3 — Card slides up from envelope (centered via margin auto, no transform conflict)
      const cardEl = scope.current?.querySelector("#card") as HTMLElement | null;
      if (cardEl) cardEl.style.zIndex = "30";
      await animate(
        "#card",
        { y: "-70%" },
        { duration: 1.0, ease: [0.22, 1, 0.36, 1] }
      );

      // 4 — Celebration confetti
      fireGoldConfetti();
      await new Promise((r) => setTimeout(r, 600));

      // 5 — Smooth cross-fade: envelope group fades while revealed card zooms in
      animate("#envelope-group", { opacity: 0 }, { duration: 0.6, ease: "easeOut" });
      animate("#petals", { opacity: 0 }, { duration: 0.4 });
      // Revealed card fades in with organic zoom
      const revealedEl = scope.current?.querySelector("#revealed") as HTMLElement | null;
      if (revealedEl) revealedEl.style.pointerEvents = "auto";
      await animate(
        "#revealed",
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      );

      // 6 — Admire full-screen invitation
      await new Promise((r) => setTimeout(r, 1400));

      // 7 — Curtain rise: entire overlay slides up
      if (scope.current) {
        scope.current.style.pointerEvents = "none";
        await animate(
          scope.current,
          { y: "-100vh" },
          { duration: 0.9, ease: [0.65, 0, 0.35, 1] }
        );
      }

      // 8 — Cleanup
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      setStage("done");
    } catch {
      // Graceful fallback if animate fails
      document.body.style.overflow = "";
      setStage("done");
    }
  }, [stage, animate, scope, mouseX, mouseY]);

  /* ── Auto-open after 7s idle ── */
  useEffect(() => {
    if (stage !== "sealed") return;
    const t = setTimeout(handleOpen, 7000);
    return () => clearTimeout(t);
  }, [stage, handleOpen]);

  /* ── Unmount when done ── */
  if (stage === "done") return null;

  const sealed = stage === "sealed";
  const envW = "min(420px, 88vw)";
  const envH = "min(280px, 60vw)";

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[10000]"
      onClick={() => sealed && handleOpen()}
      style={{ cursor: sealed ? "pointer" : "default" }}
    >
      {/* ════════════════════════════════════
          BACKGROUND LAYERS
          ════════════════════════════════════ */}

      {/* Warm cream base */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "#FAF7F2" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Watercolor texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/fond_enveloppe.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
          mixBlendMode: "multiply",
        }}
      />

      {/* Animated golden glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.1) 0%, rgba(196,145,138,0.05) 30%, transparent 60%)",
            "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.18) 0%, rgba(196,145,138,0.08) 35%, transparent 65%)",
            "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.1) 0%, rgba(196,145,138,0.05) 30%, transparent 60%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,169,110,0.6) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ════════════════════════════════════
          FLOATING PETALS (ambient)
          ════════════════════════════════════ */}
      <div id="petals" className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 8 + (i % 4) * 4,
              height: 12 + (i % 3) * 5,
              left: `${5 + ((i * 5.3) % 90)}%`,
              top: `${8 + ((i * 7.1) % 84)}%`,
            }}
            animate={{
              y: [0, -(40 + i * 8), 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 2), 0],
              opacity: [0, 0.6, 0],
              rotate: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 5), 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + (i % 5) * 1.2,
              repeat: Infinity,
              delay: (i * 0.8) % 6,
              ease: "easeInOut",
            }}
          >
            <PetalPath color={PETAL_COLORS[i % PETAL_COLORS.length]} />
          </motion.div>
        ))}
        {/* Gold sparkles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`s-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 2),
              height: 2 + (i % 2),
              left: `${10 + ((i * 9.1) % 80)}%`,
              top: `${15 + ((i * 11.3) % 70)}%`,
              background: "#C9A96E",
            }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i * 1.1) % 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════
          INTRO TEXT
          ════════════════════════════════════ */}
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "min(12px, 3vw)",
                  color: "rgba(61,53,41,0.6)",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                }}
              >
                Vous avez reçu une invitation
              </p>
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          ENVELOPE GROUP
          (faded out during zoom transition)
          ════════════════════════════════════ */}
      <div
        id="envelope-group"
        className="absolute inset-0 z-20 flex items-center justify-center"
      >
        <div style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}>
          {/* Entry animation wrapper (declarative — different from imperative targets) */}
          <motion.div
            initial={{ scale: 0, rotateZ: -5, opacity: 0 }}
            animate={
              stage !== "intro"
                ? { scale: 1, rotateZ: 0, opacity: 1 }
                : { scale: 0, rotateZ: -5, opacity: 0 }
            }
            transition={{
              scale: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
              opacity: { duration: 0.9, ease: "easeOut" },
              rotateZ: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
          >
            {/* Parallax tilt wrapper */}
            <motion.div
              style={{
                rotateX: sealed ? springRotateX : 0,
                rotateY: sealed ? springRotateY : 0,
                transformStyle: "preserve-3d",
              }}
            >
              {/* ── Rose frame (real watercolor) ── */}
              <motion.div
                className="pointer-events-none absolute"
                style={{
                  width: "min(580px, 122vw)",
                  height: "min(400px, 86vw)",
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={
                  stage !== "intro"
                    ? { opacity: 0.92, scale: 1 }
                    : { opacity: 0, scale: 0.7 }
                }
                transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/roses-frame.jpeg"
                  alt=""
                  className="h-full w-full object-contain"
                  style={{ mixBlendMode: "multiply" }}
                  draggable={false}
                />
              </motion.div>

              {/* ── Envelope shadow ── */}
              <motion.div
                className="absolute rounded-3xl"
                style={{
                  width: envW,
                  height: "30px",
                  bottom: "-20px",
                  left: "50%",
                  x: "-50%",
                  background: "rgba(150,120,70,0.15)",
                  filter: "blur(20px)",
                }}
                animate={sealed ? { scaleX: [0.9, 1, 0.9] } : { scaleX: 1 }}
                transition={{
                  duration: 3,
                  repeat: sealed ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />

              {/* ── Envelope body ── */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: envW,
                  height: envH,
                  transformStyle: "preserve-3d",
                  boxShadow:
                    "0 8px 30px rgba(120,95,50,0.12), 0 25px 50px rgba(100,80,40,0.08)",
                }}
              >
                {/* Back panel */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(145deg, #f2e8d2 0%, #e9dcbe 40%, #e0d0a8 100%)",
                  }}
                />

                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Gold liner (visible when flap opens) */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(201,169,110,0.12) 0%, rgba(168,137,77,0.05) 100%)",
                    opacity: 0.3,
                  }}
                >
                  <LinerPattern />
                </div>

                {/* Bottom flap */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "60%",
                    background:
                      "linear-gradient(180deg, #dcc790 0%, #d4be84 100%)",
                    clipPath: "polygon(0% 100%, 50% 10%, 100% 100%)",
                    zIndex: 2,
                  }}
                >
                  <div
                    className="absolute inset-x-[10%] top-[12%] h-[20%]"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(170,145,90,0.06), transparent)",
                    }}
                  />
                </div>

                {/* Left flap */}
                <div
                  className="absolute top-0 bottom-0 left-0"
                  style={{
                    width: "54%",
                    background:
                      "linear-gradient(100deg, #e2d2a6 0%, #d9c894 100%)",
                    clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)",
                    zIndex: 3,
                  }}
                />

                {/* Right flap */}
                <div
                  className="absolute top-0 right-0 bottom-0"
                  style={{
                    width: "54%",
                    background:
                      "linear-gradient(260deg, #e2d2a6 0%, #d9c894 100%)",
                    clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
                    zIndex: 3,
                  }}
                />

                {/* Paper speckle texture */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0h1v1H2V0zm3 3h1v1H5V3zM0 4h1v1H0V4z' fill='%23a08860' fill-opacity='1'/%3E%3C/svg%3E")`,
                    zIndex: 10,
                  }}
                />

                {/* Gold border trim */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    border: "1.5px solid rgba(201,169,110,0.22)",
                    zIndex: 11,
                  }}
                />
                <div
                  className="absolute rounded-xl"
                  style={{
                    inset: "3px",
                    border: "0.5px solid rgba(201,169,110,0.1)",
                    zIndex: 11,
                  }}
                />
              </div>

              {/* ── TOP FLAP (3D — animated by useAnimate) ── */}
              <div
                id="flap"
                className="absolute left-0 right-0 top-0"
                style={{
                  width: envW,
                  height: "min(155px, 34vw)",
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  zIndex: 20,
                }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, #ebd9b2 0%, #dece9e 60%, #d4c28e 100%)",
                    clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(1% 0%, 50% 98%, 99% 0%)",
                      borderBottom: "1px solid rgba(201,169,110,0.15)",
                    }}
                  />
                  <div
                    className="absolute inset-x-[5%] bottom-0 h-[30%]"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(170,145,90,0.08), transparent)",
                    }}
                  />
                </div>

                {/* Back face (gold liner) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(201,169,110,0.25) 0%, rgba(168,137,77,0.12) 100%)",
                    clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}
                >
                  <LinerPattern />
                </div>
              </div>

              {/* ── WAX SEAL (animated by useAnimate) ── */}
              <div
                id="seal"
                ref={sealRef}
                className="absolute left-0 right-0 mx-auto"
                style={{
                  width: 88,
                  top: "min(100px, 22vw)",
                  zIndex: 25,
                  opacity: stage === "intro" ? 0 : 1,
                  transition: "opacity 0.6s ease-out",
                }}
              >
                {/* Pulsing glow (declarative, different element) */}
                {sealed && (
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: "min(120px, 26vw)",
                      height: "min(120px, 26vw)",
                      background:
                        "radial-gradient(circle, rgba(201,169,110,0.25) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <WaxSeal />
              </div>

              {/* ── CARD inside envelope (animated by useAnimate) ── */}
              <div
                id="card"
                className="absolute left-0 right-0 mx-auto"
                style={{
                  width: "min(370px, 80vw)",
                  bottom: "10px",
                  zIndex: 5,
                }}
              >
                <div
                  className="rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFFDF9 0%, #FAF7F2 40%, #F0EBE1 100%)",
                    border: "1px solid rgba(201,169,110,0.25)",
                    boxShadow:
                      "0 12px 40px rgba(120,95,50,0.10), 0 4px 16px rgba(100,80,40,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
                    padding: "min(32px, 7vw) min(24px, 5vw)",
                    minHeight: "min(220px, 48vw)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Watercolor bg */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: "url(/images/fond_enveloppe.jpg)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* Inner gold border */}
                  <div
                    className="absolute rounded-xl"
                    style={{
                      inset: "8px",
                      border: "0.5px solid rgba(201,169,110,0.18)",
                    }}
                  />
                  {/* Filigree corners */}
                  <FiligreCorner className="absolute top-1.5 left-1.5 w-7 h-7" />
                  <FiligreCorner className="absolute top-1.5 right-1.5 w-7 h-7" style={{ transform: "scaleX(-1)" }} />
                  <FiligreCorner className="absolute bottom-1.5 left-1.5 w-7 h-7" style={{ transform: "scaleY(-1)" }} />
                  <FiligreCorner className="absolute bottom-1.5 right-1.5 w-7 h-7" style={{ transform: "scale(-1,-1)" }} />

                  <CardContent />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════
          CTA — "Touchez pour ouvrir"
          ════════════════════════════════════ */}
      <AnimatePresence>
        {sealed && (
          <motion.div
            className="absolute z-30 flex flex-col items-center gap-3"
            style={{ bottom: "min(60px, 14vw)", left: "50%", x: "-50%" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-3"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,169,110,0.5))",
                }}
              />
              <p
                className="tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "min(11px, 2.8vw)",
                  color: "rgba(61,53,41,0.5)",
                }}
              >
                Touchez pour ouvrir
              </p>
              <div
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,169,110,0.5), transparent)",
                }}
              />
            </motion.div>
            <motion.svg
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              animate={{ y: [0, 5, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M18 11V6a2 2 0 0 0-4 0v5" />
              <path d="M14 10V4a2 2 0 0 0-4 0v7" />
              <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          REVEALED CARD (full-screen zoom)
          Starts hidden, animated by useAnimate
          ════════════════════════════════════ */}
      <div
        id="revealed"
        className="absolute inset-0 z-40 flex items-center justify-center"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        {/* Warm background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #FAF7F2 0%, #F5EDE0 50%, #F0E8D8 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "url(/images/fond_enveloppe.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "multiply",
          }}
        />

        {/* Large invitation card */}
        <div
          className="relative rounded-3xl text-center"
          style={{
            background:
              "linear-gradient(180deg, #FFFDF9 0%, #FAF7F2 30%, #F5EDE0 70%, #F0EBE1 100%)",
            border: "1px solid rgba(201,169,110,0.25)",
            boxShadow:
              "0 25px 80px rgba(120,95,50,0.10), 0 8px 30px rgba(100,80,40,0.06), 0 0 0 1px rgba(201,169,110,0.08)",
            padding: "min(52px, 11vw) min(44px, 9vw)",
            maxWidth: "min(480px, 90vw)",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Watercolor bg */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "url(/images/fond_enveloppe.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Inner border */}
          <div
            className="absolute rounded-xl"
            style={{
              inset: "12px",
              border: "0.5px solid rgba(201,169,110,0.2)",
            }}
          />
          {/* Filigree corners */}
          <FiligreCorner className="absolute top-2 left-2 w-8 h-8" />
          <FiligreCorner className="absolute top-2 right-2 w-8 h-8" style={{ transform: "scaleX(-1)" }} />
          <FiligreCorner className="absolute bottom-2 left-2 w-8 h-8" style={{ transform: "scaleY(-1)" }} />
          <FiligreCorner className="absolute bottom-2 right-2 w-8 h-8" style={{ transform: "scale(-1,-1)" }} />

          <CardContent large />
        </div>
      </div>
    </div>
  );
}
