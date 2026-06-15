/**
 * Script pour générer les icônes PNG depuis le SVG.
 * Usage : node scripts/generate-icons.mjs
 * Prérequis : npm install -D sharp
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, "../public/icons/icon.svg");
const svgBuffer = readFileSync(svgPath);

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../public/icons/icon-${size}.png`));
  console.log(`✅ icon-${size}.png généré`);
}
