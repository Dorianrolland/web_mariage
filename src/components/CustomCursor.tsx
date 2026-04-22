"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show custom cursor on devices with fine pointer (desktop)
    const hasFineCursor = window.matchMedia("(pointer: fine)").matches;
    if (!hasFineCursor) return;

    document.body.classList.add("custom-cursor-active");
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10002] mix-blend-difference"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full bg-gold"
          animate={{
            width: isHovering ? 48 : 8,
            height: isHovering ? 48 : 8,
            x: isHovering ? -24 : -4,
            y: isHovering ? -24 : -4,
            opacity: isHovering ? 0.3 : 0.8,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>
      {/* Cursor ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10001]"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full border border-gold/30"
          animate={{
            width: isHovering ? 64 : 32,
            height: isHovering ? 64 : 32,
            x: isHovering ? -32 : -16,
            y: isHovering ? -32 : -16,
            opacity: isHovering ? 0.5 : 0.3,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>
    </>
  );
}
