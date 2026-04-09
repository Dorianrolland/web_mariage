"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import confetti from "canvas-confetti";

type Stage = "intro" | "sealed" | "breaking" | "opening" | "sliding" | "revealed" | "exiting" | "done";

/* ─── Confetti helpers ─── */
function fireGoldConfetti() {
  const colors = ["#C9A96E", "#D4B87A", "#A8894D", "#E8D5B0", "#C4918A"];
  const end = Date.now() + 1800;
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors, ticks: 200, gravity: 0.8, scalar: 1.2, shapes: ["circle", "square"], drift: 0.5 });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors, ticks: 200, gravity: 0.8, scalar: 1.2, shapes: ["circle", "square"], drift: -0.5 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

function fireSealBurst(x: number, y: number) {
  confetti({ particleCount: 40, startVelocity: 20, spread: 360, origin: { x: x / window.innerWidth, y: y / window.innerHeight }, colors: ["#C9A96E", "#D4B87A", "#A8894D", "#C4918A"], ticks: 120, gravity: 0.6, scalar: 0.8, shapes: ["circle"] });
}

/* ─── Floral frame using real rose images ─── */

/* ─── Floating petal shape ─── */
const PETAL_COLORS = ["#C4918A", "#D4A9A3", "#E8C8C0", "#C9A96E", "#D4B87A", "#DEB8AF"];

function PetalPath({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0 Q16 5 14 12 Q12 18 10 20 Q8 18 6 12 Q4 5 10 0Z" fill={color} opacity="0.7" />
      <path d="M10 2 Q14 6 12 11 Q11 15 10 17 Q9 15 8 11 Q6 6 10 2Z" fill={color} opacity="0.4" />
    </svg>
  );
}

/* ─── Wax Seal (static, pre-computed to avoid hydration mismatch) ─── */
const SEAL_PATH = "M 84.48 44.00 Q 78.03 48.48 83.10 54.48 Q 75.71 57.13 79.06 64.24 Q 71.23 64.89 72.62 72.62 Q 64.89 71.23 64.24 79.06 Q 57.13 75.71 54.48 83.10 Q 48.48 78.03 44.00 84.48 Q 39.52 78.03 33.52 83.10 Q 30.87 75.71 23.76 79.06 Q 23.11 71.23 15.38 72.62 Q 16.77 64.89 8.94 64.24 Q 12.29 57.13 4.90 54.48 Q 9.97 48.48 3.52 44.00 Q 9.97 39.52 4.90 33.52 Q 12.29 30.87 8.94 23.76 Q 16.77 23.11 15.38 15.38 Q 23.11 16.77 23.76 8.94 Q 30.87 12.29 33.52 4.90 Q 39.52 9.97 44.00 3.52 Q 48.48 9.97 54.48 4.90 Q 57.13 12.29 64.24 8.94 Q 64.89 16.77 72.62 15.38 Q 71.23 23.11 79.06 23.76 Q 75.71 30.87 83.10 33.52 Q 78.03 39.52 84.48 44.00 Z";
const SEAL_DOTS = [[73.48,44],[71.24,55.28],[64.85,64.85],[55.28,71.24],[44,73.48],[32.72,71.24],[23.15,64.85],[16.76,55.28],[14.52,44],[16.76,32.72],[23.15,23.15],[32.72,16.76],[44,14.52],[55.28,16.76],[64.85,23.15],[71.24,32.72]];

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
        <radialGradient id="sealHighlight" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="sealShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(100,70,30,0.5)" />
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="rgba(80,55,20,0.25)" />
        </filter>
        <filter id="sealTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>

      <path d={SEAL_PATH} fill="url(#sealGrad)" filter="url(#sealShadow)" />
      <path d={SEAL_PATH} fill="url(#sealGrad)" filter="url(#sealTexture)" opacity="0.4" />
      <path d={SEAL_PATH} fill="url(#sealHighlight)" />

      <circle cx="44" cy="44" r="27.28" fill="none" stroke="rgba(139,111,58,0.5)" strokeWidth="1.2" />
      <circle cx="44" cy="44" r="24.2" fill="none" stroke="rgba(232,213,176,0.35)" strokeWidth="0.7" />
      <circle cx="44" cy="44" r="31.68" fill="none" stroke="rgba(139,111,58,0.3)" strokeWidth="0.5" />
      {SEAL_DOTS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.8" fill="rgba(232,213,176,0.4)" />
      ))}

      <text x="44" y="45" textAnchor="middle" dominantBaseline="central" fill="rgba(250,247,242,0.9)" fontSize="15" fontFamily="var(--font-serif)" fontWeight="600" letterSpacing="2" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>C &amp; D</text>
      <text x="44" y="59" textAnchor="middle" dominantBaseline="central" fill="rgba(250,247,242,0.6)" fontSize="6.2" fontFamily="var(--font-sans)" letterSpacing="3">04.09.27</text>
    </svg>
  );
}

/* ─── Gold liner pattern ─── */
function LinerPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
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

/* ─── Filigree corner ornament for card ─── */
function FiligreCorner({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 50 50" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2 Q2 25 25 25 Q25 2 2 2Z" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4" />
      <path d="M5 5 Q5 22 22 22 Q22 5 5 5Z" fill="none" stroke="#C9A96E" strokeWidth="0.3" opacity="0.3" />
      <path d="M2 2 Q14 8 25 25" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.35" />
      <circle cx="8" cy="8" r="1.5" fill="#C9A96E" opacity="0.3" />
      <circle cx="14" cy="14" r="1" fill="#C9A96E" opacity="0.25" />
    </svg>
  );
}

/* ─── Main Component ─── */
export default function IntroAnimation() {
  const [stage, setStage] = useState<Stage>("intro");
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  // Mouse parallax for sealed state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  // Lock scroll
  useEffect(() => {
    if (stage !== "done") {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [stage]);

  // Intro → sealed transition
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === "intro") setStage("sealed");
    }, 1800);
    return () => clearTimeout(timer);
  }, [stage]);

  // Mouse tracking for 3D tilt
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (stage !== "sealed") return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(clientX - cx);
      mouseY.set(clientY - cy);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [stage, mouseX, mouseY]);

  const handleOpen = useCallback(() => {
    if (stage !== "sealed") return;
    if (sealRef.current) {
      const rect = sealRef.current.getBoundingClientRect();
      fireSealBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    setStage("breaking");
    setTimeout(() => setStage("opening"), 600);
    setTimeout(() => setStage("sliding"), 1400);
    setTimeout(() => {
      fireGoldConfetti();
      setStage("revealed");
    }, 2400);
    setTimeout(() => setStage("exiting"), 4000);
    setTimeout(() => setStage("done"), 5000);
  }, [stage]);

  // Auto-open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === "sealed") handleOpen();
    }, 7000);
    return () => clearTimeout(timer);
  }, [stage, handleOpen]);

  if (stage === "done") return null;

  const envW = "min(420px, 88vw)";
  const envH = "min(280px, 60vw)";

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      animate={{ y: stage === "exiting" ? "-100vh" : 0 }}
      transition={{ y: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
      onClick={() => stage === "sealed" && handleOpen()}
      style={{ cursor: stage === "sealed" ? "pointer" : "default" }}
    >
      {/* ─── Background: warm cream with watercolor ─── */}
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

      {/* Warm radial glow */}
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
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,169,110,0.6) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ─── Floating petals (instead of gold dust) ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 8 + (i % 4) * 4,
              height: 12 + (i % 3) * 5,
              left: `${5 + (i * 5.3) % 90}%`,
              top: `${8 + (i * 7.1) % 84}%`,
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
        {/* Small gold sparkles mixed in */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 2),
              height: 2 + (i % 2),
              left: `${10 + (i * 9.1) % 80}%`,
              top: `${15 + (i * 11.3) % 70}%`,
              background: "#C9A96E",
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i * 1.1) % 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ─── INTRO TEXT ─── */}
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            className="absolute z-30 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "min(12px, 3vw)", color: "rgba(61,53,41,0.6)", letterSpacing: "0.4em", textTransform: "uppercase" }}>
              Vous avez reçu une invitation
            </p>
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ENVELOPE ─── */}
      <motion.div
        className="relative z-20"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
        initial={{ scale: 0, rotateZ: -5, opacity: 0 }}
        animate={{
          scale: stage === "intro" ? 0 : stage === "revealed" || stage === "exiting" ? 0.85 : 1,
          rotateZ: 0,
          opacity: stage === "intro" ? 0 : stage === "revealed" || stage === "exiting" ? 0 : 1,
          y: stage === "revealed" || stage === "exiting" ? 80 : 0,
        }}
        transition={{
          scale: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
          opacity: { duration: stage === "revealed" ? 0.6 : 0.9, ease: "easeOut" },
          y: { duration: 0.8, ease: "easeOut" },
          rotateZ: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
      >
        {/* 3D tilt wrapper */}
        <motion.div
          style={{
            rotateX: stage === "sealed" ? springRotateX : 0,
            rotateY: stage === "sealed" ? springRotateY : 0,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ── Real rose frame around envelope ── */}
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
            animate={{ opacity: stage === "intro" ? 0 : 0.92, scale: stage === "intro" ? 0.7 : 1 }}
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

          {/* Envelope shadow */}
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
            animate={{ scaleX: stage === "sealed" ? [0.9, 1, 0.9] : 1 }}
            transition={{ duration: 3, repeat: stage === "sealed" ? Infinity : 0, ease: "easeInOut" }}
          />

          {/* ── Envelope body (WARM COLORS) ── */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              width: envW,
              height: envH,
              transformStyle: "preserve-3d",
              boxShadow: "0 8px 30px rgba(120,95,50,0.12), 0 25px 50px rgba(100,80,40,0.08)",
            }}
          >
            {/* Back panel - warm tones */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: "linear-gradient(145deg, #f2e8d2 0%, #e9dcbe 40%, #e0d0a8 100%)" }}
            />

            {/* Paper texture (visible) */}
            <div
              className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Gold liner (visible when flap opens) */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{ background: "linear-gradient(180deg, rgba(201,169,110,0.12) 0%, rgba(168,137,77,0.05) 100%)" }}
              animate={{ opacity: stage === "opening" || stage === "sliding" || stage === "revealed" || stage === "exiting" ? 1 : 0.3 }}
            >
              <LinerPattern />
            </motion.div>

            {/* Bottom flap */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: "60%",
                background: "linear-gradient(180deg, #dcc790 0%, #d4be84 100%)",
                clipPath: "polygon(0% 100%, 50% 10%, 100% 100%)",
                zIndex: 2,
              }}
            >
              <div className="absolute inset-x-[10%] top-[12%] h-[20%]" style={{ background: "linear-gradient(to bottom, rgba(170,145,90,0.06), transparent)" }} />
            </div>

            {/* Left flap */}
            <div
              className="absolute top-0 bottom-0 left-0"
              style={{
                width: "54%",
                background: "linear-gradient(100deg, #e2d2a6 0%, #d9c894 100%)",
                clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)",
                zIndex: 3,
              }}
            />

            {/* Right flap */}
            <div
              className="absolute top-0 right-0 bottom-0"
              style={{
                width: "54%",
                background: "linear-gradient(260deg, #e2d2a6 0%, #d9c894 100%)",
                clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
                zIndex: 3,
              }}
            />

            {/* Paper texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 0h1v1H2V0zm3 3h1v1H5V3zM0 4h1v1H0V4z' fill='%23a08860' fill-opacity='1'/%3E%3C/svg%3E")`,
                zIndex: 10,
              }}
            />

            {/* Gold border trim */}
            <div className="absolute inset-0 rounded-2xl" style={{ border: "1.5px solid rgba(201,169,110,0.22)", zIndex: 11 }} />
            <div className="absolute rounded-xl" style={{ inset: "3px", border: "0.5px solid rgba(201,169,110,0.1)", zIndex: 11 }} />
          </div>

          {/* ── TOP FLAP (3D rotating, warm colors) ── */}
          <motion.div
            className="absolute left-0 right-0 top-0"
            style={{
              width: envW,
              height: "min(155px, 34vw)",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: stage === "opening" || stage === "sliding" || stage === "revealed" || stage === "exiting" ? 1 : 20,
            }}
            animate={{ rotateX: stage === "opening" || stage === "sliding" || stage === "revealed" || stage === "exiting" ? 180 : 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Front of flap */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #ebd9b2 0%, #dece9e 60%, #d4c28e 100%)",
                clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="absolute inset-0" style={{ clipPath: "polygon(1% 0%, 50% 98%, 99% 0%)", borderBottom: "1px solid rgba(201,169,110,0.15)" }} />
              {/* Fold shadow */}
              <div className="absolute inset-x-[5%] bottom-0 h-[30%]" style={{ background: "linear-gradient(to top, rgba(170,145,90,0.08), transparent)" }} />
            </div>

            {/* Back of flap (gold liner) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(201,169,110,0.25) 0%, rgba(168,137,77,0.12) 100%)",
                clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <LinerPattern />
            </div>
          </motion.div>

          {/* ── WAX SEAL ── */}
          <motion.div
            ref={sealRef}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "min(100px, 22vw)", zIndex: 25 }}
            animate={{
              scale: stage === "breaking" ? [1, 1.2, 1.25, 0] : stage === "intro" ? 0 : 1,
              opacity: stage === "breaking" ? [1, 1, 0.8, 0] : stage === "intro" ? 0 : 1,
              rotate: stage === "breaking" ? [0, 5, -8, 15] : 0,
            }}
            transition={{
              duration: stage === "breaking" ? 0.7 : 0.6,
              ease: stage === "breaking" ? [0.34, 1.56, 0.64, 1] : "easeOut",
            }}
          >
            {/* Seal glow */}
            {stage === "sealed" && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: "min(120px, 26vw)", height: "min(120px, 26vw)", background: "radial-gradient(circle, rgba(201,169,110,0.25) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <WaxSeal />
          </motion.div>

          {/* ── INVITATION CARD (slides up) ── */}
          <motion.div
            className="absolute left-1/2"
            style={{ width: "min(370px, 80vw)", x: "-50%", bottom: "10px", zIndex: 5 }}
            animate={{ y: stage === "sliding" || stage === "revealed" || stage === "exiting" ? "min(-340px, -74vw)" : 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 18, mass: 1 }}
          >
            <motion.div
              className="rounded-xl"
              style={{
                background: "linear-gradient(180deg, #FFFDF9 0%, #FAF7F2 40%, #F0EBE1 100%)",
                border: "1px solid rgba(201,169,110,0.3)",
                boxShadow: "0 10px 40px rgba(120,95,50,0.12), 0 2px 10px rgba(100,80,40,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                padding: "min(32px, 7vw) min(24px, 5vw)",
                minHeight: "min(220px, 48vw)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle watercolor background on card */}
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url(/images/fond_enveloppe.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />

              {/* Inner gold border */}
              <div className="absolute rounded-lg" style={{ inset: "8px", border: "0.5px solid rgba(201,169,110,0.2)" }} />
              {/* Filigree corners */}
              <FiligreCorner className="absolute top-1 left-1 w-6 h-6" />
              <FiligreCorner className="absolute top-1 right-1 w-6 h-6" style={{ transform: "scaleX(-1)" }} />
              <FiligreCorner className="absolute bottom-1 left-1 w-6 h-6" style={{ transform: "scaleY(-1)" }} />
              <FiligreCorner className="absolute bottom-1 right-1 w-6 h-6" style={{ transform: "scale(-1,-1)" }} />

              {/* Card content */}
              <div className="relative text-center">
                <div className="mb-5 flex items-center justify-center gap-3">
                  <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A96E)" }} />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A96E" opacity="0.6">
                    <path d="M12 2L12.9 8.1L18 4.9L14.8 10.1L20.9 11L14.8 11.9L18 17.1L12.9 13.9L12 20L11.1 13.9L6 17.1L9.2 11.9L3.1 11L9.2 10.1L6 4.9L11.1 8.1L12 2Z" />
                  </svg>
                  <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, #C9A96E, transparent)" }} />
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "min(10px, 2.5vw)", color: "#C9A96E", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "min(16px, 3.5vw)" }}>
                  Vous êtes conviés au mariage de
                </p>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "min(32px, 7vw)", fontWeight: 700, color: "#3D3529", lineHeight: 1.2, marginBottom: "4px" }}>Clémence</h2>
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "min(22px, 5vw)", color: "#C9A96E", display: "block", margin: "4px 0" }}>&amp;</span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "min(32px, 7vw)", fontWeight: 700, color: "#3D3529", lineHeight: 1.2, marginBottom: "min(16px, 3.5vw)" }}>Dorian</h2>
                <div className="mx-auto" style={{ width: "50px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A96E, transparent)", marginBottom: "min(12px, 2.5vw)" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "min(16px, 3.5vw)", color: "#3D3529", lineHeight: 1.6 }}>Samedi 4 Septembre 2027</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "min(9px, 2.2vw)", color: "rgba(61,53,41,0.55)", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "6px" }}>
                  Château de Chaussy &middot; Ardèche
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A96E)" }} />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A96E" opacity="0.6">
                    <path d="M12 2L12.9 8.1L18 4.9L14.8 10.1L20.9 11L14.8 11.9L18 17.1L12.9 13.9L12 20L11.1 13.9L6 17.1L9.2 11.9L3.1 11L9.2 10.1L6 4.9L11.1 8.1L12 2Z" />
                  </svg>
                  <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, #C9A96E, transparent)" }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ─── CTA (tap to open) ─── */}
      <AnimatePresence>
        {stage === "sealed" && (
          <motion.div
            className="absolute z-30 flex flex-col items-center gap-3"
            style={{ bottom: "min(60px, 14vw)" }}
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
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.5))" }} />
              <p className="tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-sans)", fontSize: "min(11px, 2.8vw)", color: "rgba(61,53,41,0.5)" }}>
                Touchez pour ouvrir
              </p>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(201,169,110,0.5), transparent)" }} />
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

      {/* ─── REVEALED: Full-screen card ─── */}
      <AnimatePresence>
        {(stage === "revealed" || stage === "exiting") && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Warm background for revealed state */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5EDE0 50%, #F0E8D8 100%)" }} />
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "url(/images/fond_enveloppe.jpg)", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "multiply" }} />

            <motion.div
              className="relative rounded-2xl text-center"
              style={{
                background: "linear-gradient(180deg, #FFFDF9 0%, #FAF7F2 40%, #F0EBE1 100%)",
                border: "1px solid rgba(201,169,110,0.3)",
                boxShadow: "0 20px 60px rgba(120,95,50,0.12), 0 4px 20px rgba(100,80,40,0.08)",
                padding: "min(48px, 10vw) min(40px, 8vw)",
                maxWidth: "min(480px, 90vw)",
                width: "100%",
                overflow: "hidden",
              }}
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            >
              {/* Subtle watercolor */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(/images/fond_enveloppe.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />

              {/* Inner border */}
              <div className="absolute rounded-xl" style={{ inset: "12px", border: "0.5px solid rgba(201,169,110,0.2)" }} />
              {/* Filigree corners on big card */}
              <FiligreCorner className="absolute top-2 left-2 w-8 h-8" />
              <FiligreCorner className="absolute top-2 right-2 w-8 h-8" style={{ transform: "scaleX(-1)" }} />
              <FiligreCorner className="absolute bottom-2 left-2 w-8 h-8" style={{ transform: "scaleY(-1)" }} />
              <FiligreCorner className="absolute bottom-2 right-2 w-8 h-8" style={{ transform: "scale(-1,-1)" }} />

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative">
                <div className="mb-6 flex items-center justify-center gap-3">
                  <motion.div className="h-px bg-gradient-to-r from-transparent to-gold/60" initial={{ width: 0 }} animate={{ width: 50 }} transition={{ delay: 0.5, duration: 0.8 }} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E" opacity="0.6">
                    <path d="M12 2L12.9 8.1L18 4.9L14.8 10.1L20.9 11L14.8 11.9L18 17.1L12.9 13.9L12 20L11.1 13.9L6 17.1L9.2 11.9L3.1 11L9.2 10.1L6 4.9L11.1 8.1L12 2Z" />
                  </svg>
                  <motion.div className="h-px bg-gradient-to-l from-transparent to-gold/60" initial={{ width: 0 }} animate={{ width: 50 }} transition={{ delay: 0.5, duration: 0.8 }} />
                </div>

                <p className="mb-5" style={{ fontFamily: "var(--font-sans)", fontSize: "min(12px, 3vw)", color: "#C9A96E", letterSpacing: "0.35em", textTransform: "uppercase" }}>
                  Nous avons la joie de vous inviter
                </p>

                <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} style={{ fontFamily: "var(--font-serif)", fontSize: "min(40px, 9vw)", fontWeight: 700, color: "#3D3529", lineHeight: 1.2 }}>Clémence</motion.h2>
                <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "min(28px, 6vw)", color: "#C9A96E", display: "block", margin: "6px 0" }}>&amp;</motion.span>
                <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} style={{ fontFamily: "var(--font-serif)", fontSize: "min(40px, 9vw)", fontWeight: 700, color: "#3D3529", lineHeight: 1.2, marginBottom: "min(20px, 4vw)" }}>Dorian</motion.h2>

                <motion.div className="mx-auto" initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.8, duration: 0.6 }} style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C9A96E, transparent)", marginBottom: "min(16px, 3.5vw)" }} />

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} style={{ fontFamily: "var(--font-body)", fontSize: "min(18px, 4vw)", color: "#3D3529", lineHeight: 1.6 }}>Samedi 4 Septembre 2027</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ fontFamily: "var(--font-body)", fontSize: "min(14px, 3.2vw)", color: "rgba(61,53,41,0.7)", marginTop: "4px" }}>Château de Chaussy &middot; Ardèche</motion.p>

                <motion.div className="mt-8 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "min(9px, 2.2vw)", color: "rgba(61,53,41,0.4)", letterSpacing: "0.25em", textTransform: "uppercase" }}>Découvrir</p>
                  <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" strokeLinecap="round" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
