"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "intro" | "playing" | "exiting" | "done";

const VIDEO_SRC = "/video/meilleur_essai.mp4";

export default function IntroAnimation() {
  const [stage, setStage] = useState<Stage>("intro");
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  /* ── Preload the video early ── */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  /* ── Launch video ── */
  const handleStart = useCallback(() => {
    if (stage !== "intro") return;
    setStage("playing");
    // Try to play (browsers may require user gesture, which we have here)
    setTimeout(() => {
      videoRef.current?.play().catch(() => {
        /* fail gracefully */
      });
    }, 50);
  }, [stage]);

  /* ── Skip / end → exit to site ── */
  const handleExit = useCallback(() => {
    if (stage !== "playing") return;
    setStage("exiting");
    setTimeout(() => {
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      setStage("done");
    }, 1000);
  }, [stage]);

  if (stage === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] overflow-hidden"
      animate={{ y: stage === "exiting" ? "-100vh" : 0 }}
      transition={{ y: { duration: 0.95, ease: [0.65, 0, 0.35, 1] } }}
    >
      {/* ════════════════════════════════════
          BACKGROUND (warm cream + watercolor)
          ════════════════════════════════════ */}
      <div className="absolute inset-0" style={{ background: "#FAF7F2" }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/fond_enveloppe.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.12) 0%, rgba(196,145,138,0.05) 35%, transparent 65%)",
            "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.20) 0%, rgba(196,145,138,0.08) 40%, transparent 70%)",
            "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.12) 0%, rgba(196,145,138,0.05) 35%, transparent 65%)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ════════════════════════════════════
          VIDEO (always mounted, hidden until playing)
          ════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{
          opacity: stage === "playing" || stage === "exiting" ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: stage === "playing" ? "auto" : "none" }}
        onClick={handleExit}
      >
        <motion.video
          ref={videoRef}
          src={VIDEO_SRC}
          className="h-full w-full object-cover"
          playsInline
          muted
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onEnded={handleExit}
          initial={{ scale: 1.1 }}
          animate={{
            scale: stage === "playing" ? 1 : stage === "exiting" ? 1.05 : 1.1,
          }}
          transition={{
            scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
          }}
        />

        {/* Subtle "click to skip" hint while playing */}
        <AnimatePresence>
          {stage === "playing" && (
            <motion.div
              className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0.6, 0.6, 0], y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 6,
                times: [0, 0.15, 0.85, 1],
                delay: 1.5,
              }}
            >
              <p
                className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm"
                style={{
                  fontFamily: "var(--font-sans)",
                  background: "rgba(0,0,0,0.25)",
                }}
              >
                Cliquez pour passer
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ════════════════════════════════════
          INTRO SCREEN (entry CTA)
          ════════════════════════════════════ */}
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating petals (ambient) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 4 + (i % 3) * 2,
                    height: 4 + (i % 3) * 2,
                    left: `${5 + ((i * 7.3) % 90)}%`,
                    top: `${10 + ((i * 8.1) % 80)}%`,
                    background:
                      i % 2 === 0
                        ? "rgba(201,169,110,0.5)"
                        : "rgba(196,145,138,0.4)",
                  }}
                  animate={{
                    y: [0, -(30 + i * 5), 0],
                    opacity: [0, 0.7, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4 + (i % 4),
                    repeat: Infinity,
                    delay: (i * 0.7) % 5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Top ornament */}
            <motion.div
              className="mb-6 flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div
                className="h-px w-16"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,169,110,0.6))",
                }}
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#C9A96E"
                opacity="0.7"
              >
                <path d="M12 2L12.9 8.1L18 4.9L14.8 10.1L20.9 11L14.8 11.9L18 17.1L12.9 13.9L12 20L11.1 13.9L6 17.1L9.2 11.9L3.1 11L9.2 10.1L6 4.9L11.1 8.1L12 2Z" />
              </svg>
              <div
                className="h-px w-16"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(201,169,110,0.6), transparent)",
                }}
              />
            </motion.div>

            {/* Invitation label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "min(11px, 2.8vw)",
                color: "rgba(61,53,41,0.55)",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                marginBottom: "min(20px, 4vw)",
              }}
            >
              Vous avez la joie d&apos;être conviés
            </motion.p>

            {/* Names */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "min(64px, 13vw)",
                fontWeight: 700,
                color: "#3D3529",
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              Clémence
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 1.4,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "min(44px, 9vw)",
                  color: "#C9A96E",
                  display: "block",
                  margin: "min(8px, 2vw) 0",
                }}
              >
                &amp;
              </motion.span>
              Dorian
            </motion.h1>

            {/* Date */}
            <motion.div
              className="mt-6 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              <div
                className="h-px w-20"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #C9A96E, transparent)",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "min(20px, 4.5vw)",
                  color: "#3D3529",
                  letterSpacing: "0.05em",
                }}
              >
                Samedi 4 Septembre 2027
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "min(10px, 2.5vw)",
                  color: "rgba(61,53,41,0.5)",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                Château de Chaussy &middot; Ardèche
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              type="button"
              onClick={handleStart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative mt-12 cursor-pointer overflow-hidden rounded-full"
              style={{
                padding: "min(16px, 3.5vw) min(40px, 8vw)",
                background:
                  "linear-gradient(135deg, #C9A96E 0%, #D4B87A 50%, #A8894D 100%)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow:
                  "0 10px 30px rgba(168,137,77,0.3), 0 4px 12px rgba(120,95,50,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut",
                }}
              />

              {/* Pulsing glow */}
              <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201,169,110,0.4), transparent 70%)",
                  zIndex: -1,
                }}
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <span
                className="relative flex items-center gap-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "min(13px, 3vw)",
                  color: "#FFFDF9",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Découvrir notre invitation
              </span>
            </motion.button>

            {/* Loading hint while video preloads */}
            {!videoReady && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 3 }}
                className="mt-6 text-xs"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "rgba(61,53,41,0.4)",
                  letterSpacing: "0.2em",
                }}
              >
                Préparation de la vidéo…
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
