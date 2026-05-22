"use client";

/**
 * <WatercolorAccent /> — une seule aquarelle, grande, à une position précise.
 * À placer dans un parent en position: relative. Décoratif (aria-hidden,
 * pointer-events: none). Aucune animation : la composition est statique.
 */

import { AQUARELLES } from "@/data/aquarelles";

type Anchor =
  | "top-left" | "top-right" | "top-center"
  | "bottom-left" | "bottom-right" | "bottom-center"
  | "left" | "right" | "center";

interface Props {
  id: string;
  anchor?: Anchor;
  offset?: { top?: string; left?: string; right?: string; bottom?: string };
  size?: number;
  mobileSize?: number;
  opacity?: number;
  rotation?: number;
  flip?: boolean;
  z?: number;
  className?: string;
}

const ANCHOR_STYLES: Record<Anchor, React.CSSProperties> = {
  "top-left":      { top: "2%",   left: "2%" },
  "top-right":     { top: "2%",   right: "2%" },
  "top-center":    { top: "2%",   left: "50%", transform: "translateX(-50%)" },
  "bottom-left":   { bottom: "2%", left: "2%" },
  "bottom-right":  { bottom: "2%", right: "2%" },
  "bottom-center": { bottom: "2%", left: "50%", transform: "translateX(-50%)" },
  "left":          { top: "50%",  left: "2%",  transform: "translateY(-50%)" },
  "right":         { top: "50%",  right: "2%", transform: "translateY(-50%)" },
  "center":        { top: "50%",  left: "50%", transform: "translate(-50%,-50%)" },
};

export default function WatercolorAccent({
  id,
  anchor = "bottom-right",
  offset,
  size = 320,
  mobileSize,
  opacity = 1,
  rotation = 0,
  flip = false,
  z = 0,
  className = "",
}: Props) {
  const aq = AQUARELLES.find((a) => a.id === id) ?? AQUARELLES[0];
  const ratio = aq.height / aq.width;

  const positionStyle: React.CSSProperties = offset
    ? { top: offset.top, left: offset.left, right: offset.right, bottom: offset.bottom }
    : ANCHOR_STYLES[anchor];

  const baseTransform = (positionStyle.transform as string) || "";
  const fullTransform =
    `${baseTransform} rotate(${rotation}deg)${flip ? " scaleX(-1)" : ""}`.trim();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{
        ...positionStyle,
        transform: fullTransform,
        opacity,
        zIndex: z,
      }}
    >
      <img
        src={aq.src}
        srcSet={aq.srcSet}
        sizes={`(max-width: 768px) ${mobileSize ?? Math.round(size * 0.6)}px, ${size}px`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{
          width: size,
          height: size * ratio,
          maxWidth: "65vw",
          maxHeight: "65vh",
          userSelect: "none",
          display: "block",
        }}
      />
    </div>
  );
}
