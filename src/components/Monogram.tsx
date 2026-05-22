"use client";

/**
 * <Monogram /> — initiales C & D entrelacées (PNG fait main).
 * Source : public/logo/IMG_0492.png
 *
 * Pas de vectorisation : on garde le PNG d'origine pour fidélité au trait.
 * La couleur ne peut pas être recolorisée (image noire) ; pour adapter
 * au fond foncé du footer, on baisse l'opacité.
 */

interface Props {
  /** Largeur en px. */
  size?: number;
  /** Opacité 0–1. */
  opacity?: number;
  /** Inverse les couleurs (utile sur fond sombre). */
  invert?: boolean;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SRC = "/logo/IMG_0492.png";
// Ratio du PNG (largeur / hauteur) — calculé une fois.
const RATIO = 2360 / 1640;

export default function Monogram({
  size = 80,
  opacity = 1,
  invert = false,
  title = "Clémence & Dorian",
  className = "",
  style,
}: Props) {
  return (
    <img
      src={SRC}
      alt={title}
      width={size}
      height={Math.round(size / RATIO)}
      draggable={false}
      className={className}
      style={{
        opacity,
        filter: invert ? "invert(1)" : undefined,
        userSelect: "none",
        display: "block",
        ...style,
      }}
    />
  );
}
