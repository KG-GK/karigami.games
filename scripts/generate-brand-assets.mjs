import sharp from "sharp";
import { fileURLToPath } from "node:url";

const assets = new URL("../public/assets/", import.meta.url);
const source = fileURLToPath(new URL("KarigamiLogoNoBGAlphaEyes.png", assets));
const cropped = await sharp(source).trim().png().toBuffer();

for (const [filename, size] of [
  ["karigami-symbol-alpha-eyes.png", 256],
  ["karigami-favicon-alpha-eyes-32.png", 32],
  ["karigami-favicon-alpha-eyes-192.png", 192],
  ["karigami-apple-touch-icon-alpha-eyes.png", 180],
]) {
  const padding = Math.round(size / 16);
  await sharp(cropped)
    .resize(size - padding * 2, size - padding * 2, { fit: "contain", background: "#00000000" })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: "#00000000" })
    .png()
    .toFile(fileURLToPath(new URL(filename, assets)));
  console.log(`${filename}: ${size} × ${size}`);
}
