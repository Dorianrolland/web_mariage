"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Notre Histoire", href: "#histoire" },
  { label: "Le Lieu", href: "#lieu" },
  { label: "Programme", href: "#programme" },
  { label: "Galerie", href: "#galerie" },
  { label: "Infos", href: "#infos" },
  { label: "RSVP", href: "#rsvp" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // Determine active section
      const sections = navItems.map((item) => item.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <AnimatePresence>
        {isScrolled && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass fixed top-0 right-0 left-0 z-50 hidden md:block"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-display text-xl text-navy"
              >
                C & D
              </button>
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    className="font-ui group relative py-1 text-charcoal transition-colors hover:text-navy"
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-300 ${
                        activeSection === item.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Toggle */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMobileOpen(true)}
            className="glass fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5 text-navy" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 backdrop-blur-lg"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5 text-cream" />
            </motion.button>

            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => handleClick(item.href)}
                  className="font-display text-2xl text-cream transition-colors hover:text-gold"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
