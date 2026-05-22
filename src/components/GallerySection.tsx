"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import WatercolorScatter from "./WatercolorScatter";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  span: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/cours.jpeg",
    alt: "La Cour d'Honneur illuminée",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "/images/ceremonie-laique.webp",
    alt: "Cérémonie laïque dans le parc",
    span: "",
  },
  {
    id: 3,
    src: "/images/jardin.webp",
    alt: "Le Parc du Château",
    span: "",
  },
  {
    id: 4,
    src: "/images/chateau.jpeg",
    alt: "Vue aérienne du domaine",
    span: "col-span-2",
  },
  {
    id: 5,
    src: "/images/entree-nuit.jpg",
    alt: "L'entrée du château de nuit",
    span: "",
  },
  {
    id: 6,
    src: "/images/salle_epoque.avif",
    alt: "La Salle d'Époque",
    span: "",
  },
  {
    id: 7,
    src: "/images/principale.jpg",
    alt: "Le Château & la piscine",
    span: "col-span-2",
  },
  {
    id: 8,
    src: "/images/interieur_gite.jpg",
    alt: "Intérieur d'un gîte",
    span: "",
  },
  {
    id: 9,
    src: "/images/plan_gites.jpeg",
    alt: "Plan du domaine",
    span: "",
  },
];

function GalleryCard({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  return (
    <ScrollReveal delay={index * 0.06} className={image.span}>
      <motion.button
        onClick={onClick}
        className="group relative h-full w-full overflow-hidden rounded-lg"
        style={{ minHeight: "180px" }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Hover overlay with reveal animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-navy/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Caption on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
          <p className="font-display text-sm text-cream drop-shadow-lg">
            {image.alt}
          </p>
        </div>

        {/* Corner decorations on hover */}
        <div className="absolute top-3 left-3 h-6 w-6 border-l-2 border-t-2 border-gold/0 transition-all duration-500 group-hover:border-gold/60" />
        <div className="absolute right-3 bottom-3 h-6 w-6 border-r-2 border-b-2 border-gold/0 transition-all duration-500 group-hover:border-gold/60" />
      </motion.button>
    </ScrollReveal>
  );
}

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
    }
  }, [lightboxIndex]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
      );
    }
  }, [lightboxIndex]);

  return (
    <section id="galerie" className="section-padding bg-white-warm relative overflow-hidden paper-grain">
      <WatercolorScatter
        density={2}
        mobileDensity={1}
        types={["insecte"]}
        zone="corners"
        seed={44}
        minSize={100}
        maxSize={160}
      />
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center md:mb-24">
          <p className="font-ui mb-4 text-gold tracking-[0.3em]">Galerie</p>
          <h2 className="font-heading mb-6 text-4xl text-navy md:text-6xl">
            Un cadre{" "}
            <span className="font-display text-gold">d&apos;exception</span>
          </h2>
          <div className="gold-line-wide" />
          <p className="mx-auto mt-6 max-w-xl text-charcoal/80">
            Pierres du XII<sup>e</sup> siècle, parc arboré de 5 hectares,
            intérieurs voûtés et terrasses ensoleillées &mdash; un avant-goût
            du cadre qui nous accueillera.
          </p>
        </ScrollReveal>

        {/* Masonry Grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
          {galleryImages.map((image, i) => (
            <GalleryCard
              key={image.id}
              image={image}
              index={i}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-dark/95 p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-cream/50 hover:bg-cream/10"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-cream" />
            </button>

            {/* Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-cream/50 hover:bg-cream/10"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-5 w-5 text-cream" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-cream/50 hover:bg-cream/10"
              aria-label="Suivant"
            >
              <ChevronRight className="h-5 w-5 text-cream" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative h-[75vh] w-full max-w-5xl overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            {/* Caption */}
            <div className="absolute bottom-6 text-center">
              <p className="font-display text-cream/80">
                {galleryImages[lightboxIndex].alt}
              </p>
              <p className="font-ui mt-1 text-xs text-cream/60">
                {lightboxIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
