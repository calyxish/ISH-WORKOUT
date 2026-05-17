#!/usr/bin/env node
// One-off script: rasterize the brand mark SVG into PNG icons for the PWA manifest
// and the iOS apple-touch-icon. Run with `npm run icons`.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "icons");

const BG = "#111110";
const FG = "#C8F400";

function markSvg({ size = 512, padding = 0, rounded = true } = {}) {
  // For maskable icons we render with safe-area padding so the mark survives
  // platform cropping. The outer square is the full size; padding shrinks the
  // inner mark.
  const r = rounded ? Math.round(size * 0.22) : 0;
  const inner = size - padding * 2;
  // mark drawing coordinates (proportional to 64-unit design)
  const scale = inner / 64;
  const ox = padding;
  const oy = padding;
  const rect = (x, y, w, h, rx = 0) =>
    `<rect x="${ox + x * scale}" y="${oy + y * scale}" width="${w * scale}" height="${h * scale}" rx="${rx * scale}" fill="${FG}"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${BG}"/>
  ${rect(14, 14, 36, 8, 2)}
  ${rect(28, 22, 8, 20, 0)}
  ${rect(14, 42, 36, 8, 2)}
</svg>`;
}

async function render(svg, outPath) {
  const buf = Buffer.from(svg);
  await sharp(buf).png().toFile(outPath);
  console.log("  wrote", outPath.replace(ROOT + "/", ""));
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // Standard PWA icons (rounded, no padding)
  await render(markSvg({ size: 192 }), join(OUT, "icon-192.png"));
  await render(markSvg({ size: 512 }), join(OUT, "icon-512.png"));

  // Maskable icon: square corners + ~10% safe padding so Android/Chrome can
  // crop to any platform shape without clipping the mark.
  await render(
    markSvg({ size: 512, padding: 52, rounded: false }),
    join(OUT, "maskable-512.png")
  );

  // Apple touch icon (180×180, opaque background, square)
  await render(
    markSvg({ size: 180, rounded: false }),
    join(ROOT, "src", "app", "apple-icon.png")
  );
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
