// Generate PWA icons programmatically using sharp + SVG
// Run: node scripts/generate-icons.mjs

import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");
const PUBLIC_DIR = join(__dirname, "..", "public");

mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

function createSvg(size) {
  const sw = Math.max(3, size / 30);
  const scale = size / 100;

  // Heartbeat wave points
  const points = [
    [18, 50], [30, 50], [36, 30], [42, 70],
    [48, 20], [54, 80], [60, 40], [66, 50], [82, 50],
  ];

  const pathData = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x * scale},${y * scale}`)
    .join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <path d="${pathData}" fill="none" stroke="white" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

async function generateIcon(size, outPath) {
  const svg = Buffer.from(createSvg(size));
  await sharp(svg).png().toFile(outPath);
  console.log(`Generated ${outPath}`);
}

async function main() {
  for (const size of SIZES) {
    await generateIcon(size, join(OUT_DIR, `icon-${size}.png`));
  }
  // Apple touch icon 180x180
  await generateIcon(180, join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("Done!");
}

main().catch(console.error);
