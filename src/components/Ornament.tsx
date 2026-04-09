"use client";

import { motion } from "framer-motion";

interface OrnamentProps {
  className?: string;
}

export default function Ornament({ className = "" }: OrnamentProps) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-4 py-12 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
    >
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50 md:w-24" />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-gold"
      >
        <path
          d="M12 2L12.9 8.1L18 4.9L14.8 10.1L20.9 11L14.8 11.9L18 17.1L12.9 13.9L12 20L11.1 13.9L6 17.1L9.2 11.9L3.1 11L9.2 10.1L6 4.9L11.1 8.1L12 2Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50 md:w-24" />
    </motion.div>
  );
}
