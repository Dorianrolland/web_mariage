#!/usr/bin/env node
/**
 * Génère une texture papier-toile tileable inspirée du grain canvas/lin
 * type brochure haut de gamme (Domaine du Bijoutier).
 *
 * Sortie : public/textures/paper-canvas.webp (tileable, fond transparent)
 *
 * Composition (de bas en haut) :
 *  1. Fibres horizontales (thread warp) — barres fines alternées chaud/froid
 *  2. Fibres verticales (thread weft)   — barres fines décalées
 *  3. Grain fractal fin (fibres aléatoires)
 *  4. Tâches diffuses (vieillissement)
 *
 * Lancement : node scripts/generate-paper-texture.mjs
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "textures");

await fs.mkdir(OUT_DIR, { recursive: true });

const SIZE = 600;

/** SVG tileable inspiré d'un papier vélin / canvas Canva — irrégulier mais
 *  organique. Fond transparent : à overlay sur le fond crème via CSS. */
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <!-- Grain fin (microfibres) — donne le grain papier -->
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" seed="11"/>
      <feColorMatrix values="0 0 0 0 0.22
                             0 0 0 0 0.14
                             0 0 0 0 0.09
                             0 0 0 0.55 0"/>
    </filter>
    <!-- Fibres longues "tissées" — bruit étiré horizontalement -->
    <filter id="fibresH" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.55" numOctaves="2" stitchTiles="stitch" seed="3"/>
      <feColorMatrix values="0 0 0 0 0.32
                             0 0 0 0 0.20
                             0 0 0 0 0.12
                             0 0 0 0.18 0"/>
    </filter>
    <!-- Fibres verticales (chaîne) — moins marquées -->
    <filter id="fibresV" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55 0.012" numOctaves="2" stitchTiles="stitch" seed="9"/>
      <feColorMatrix values="0 0 0 0 0.42
                             0 0 0 0 0.30
                             0 0 0 0 0.18
                             0 0 0 0.12 0"/>
    </filter>
    <!-- Macro-variations chaleureuses (vieillissement papier) -->
    <filter id="macro" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" stitchTiles="stitch" seed="5"/>
      <feColorMatrix values="0 0 0 0 0.55
                             0 0 0 0 0.40
                             0 0 0 0 0.25
                             0 0 0 0.12 0"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" filter="url(#macro)"/>
  <rect width="100%" height="100%" filter="url(#fibresH)"/>
  <rect width="100%" height="100%" filter="url(#fibresV)"/>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.55"/>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf, { density: 144 })
  .resize(SIZE, SIZE)
  .webp({ quality: 78, alphaQuality: 90, effort: 5 })
  .toFile(path.join(OUT_DIR, "paper-canvas.webp"));

await sharp(buf, { density: 144 })
  .resize(SIZE, SIZE)
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT_DIR, "paper-canvas.png"));

console.log("✓ Texture papier-toile générée :");
console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "paper-canvas.webp"))}`);
console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, "paper-canvas.png"))}`);
