"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxDividerProps {
  src: string;
  alt: string;
  quote?: string;
  author?: string;
}

export default function ParallaxDivider({
  src,
  alt,
  quote,
  author,
}: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      ref={ref}
      className="relative h-[50vh] min-h-[350px] overflow-hidden md:h-[60vh]"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-[-15%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/50" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(27,42,74,0.5) 100%)",
        }}
      />

      {/* Content */}
      {quote && (
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ opacity }}
        >
          <div className="mx-auto max-w-2xl">
            <div className="gold-line-wide mb-8" />
            <blockquote className="font-display text-2xl text-cream/90 md:text-4xl">
              &laquo; {quote} &raquo;
            </blockquote>
            {author && (
              <p className="font-ui mt-6 text-xs text-gold/70 tracking-[0.2em]">
                {author}
              </p>
            )}
            <div className="gold-line-wide mt-8" />
          </div>
        </motion.div>
      )}
    </section>
  );
}
