const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const rawJpeg = fs.readFileSync('src/assets/img/arya-logo22.jpeg');
const { width, height, data } = jpeg.decode(rawJpeg, { useTArray: true });

console.log(`Original: ${width}x${height}`);

// Content bounds
// y from 69 to 913, x from 122 to 1411
const minX = 122;
const maxX = 1411;
const minY = 65;
const maxY = 913;

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

console.log(`Cropped: ${cropW}x${cropH}`);

// 1. Standard Transparent Logo (for Light/White Backgrounds, Navbar, etc.)
// - Transparent everywhere outside content
// - Transparent inside letters (A, R, D, O, etc.)
const logoLight = new PNG({ width: cropW, height: cropH });

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const origX = minX + x;
    const origY = minY + y;
    const srcIdx = (origY * width + origX) * 4;
    const dstIdx = (y * cropW + x) * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const isNeutral = (maxVal - minVal) < 16;

    if (isNeutral && minVal > 248) {
      // 100% transparent
      logoLight.data[dstIdx] = 255;
      logoLight.data[dstIdx + 1] = 255;
      logoLight.data[dstIdx + 2] = 255;
      logoLight.data[dstIdx + 3] = 0;
    } else if (isNeutral && minVal > 218) {
      // Anti-aliased transition
      const factor = (minVal - 218) / (248 - 218);
      const alpha = Math.round((1 - factor) * 255);
      const invFactor = Math.max(0.01, 1 - factor);

      logoLight.data[dstIdx] = Math.min(255, Math.max(0, Math.round((r - 255 * factor) / invFactor)));
      logoLight.data[dstIdx + 1] = Math.min(255, Math.max(0, Math.round((g - 255 * factor) / invFactor)));
      logoLight.data[dstIdx + 2] = Math.min(255, Math.max(0, Math.round((b - 255 * factor) / invFactor)));
      logoLight.data[dstIdx + 3] = alpha;
    } else {
      logoLight.data[dstIdx] = r;
      logoLight.data[dstIdx + 1] = g;
      logoLight.data[dstIdx + 2] = b;
      logoLight.data[dstIdx + 3] = 255;
    }
  }
}

fs.writeFileSync('public/arya-logo-transparent.png', PNG.sync.write(logoLight));
fs.writeFileSync('src/assets/img/arya-logo-transparent.png', PNG.sync.write(logoLight));
console.log('Saved arya-logo-transparent.png');

// 2. High-Contrast White/Gold Transparent Logo (for Dark Backgrounds like Footer, Admin Sidebar)
// - Transparent outside
// - All dark navy letters ("ARYA HOLIDAYS", tagline, "AH", plane, continents) become crisp pure white #FFFFFF
// - All yellow/gold swoosh & dashes remain brilliant gold #F5B301
const logoDark = new PNG({ width: cropW, height: cropH });

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const origX = minX + x;
    const origY = minY + y;
    const srcIdx = (origY * width + origX) * 4;
    const dstIdx = (y * cropW + x) * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const isNeutral = (maxVal - minVal) < 18;

    if (isNeutral && minVal > 246) {
      // Transparent background
      logoDark.data[dstIdx] = 255;
      logoDark.data[dstIdx + 1] = 255;
      logoDark.data[dstIdx + 2] = 255;
      logoDark.data[dstIdx + 3] = 0;
    } else {
      // Is it gold/yellow?
      // Gold swoosh has high R and G, lower B (r > 160, g > 110, b < 100, and r > b + 50)
      const isGold = (r > 150 && g > 100 && b < 120 && (r - b) > 50);

      if (isGold) {
        logoDark.data[dstIdx] = r;
        logoDark.data[dstIdx + 1] = g;
        logoDark.data[dstIdx + 2] = b;
        logoDark.data[dstIdx + 3] = 255;
      } else {
        // It's part of the blue content or anti-aliased edge
        // Calculate intensity / darkness
        // Original dark pixels had darkness = 255 - minVal
        if (minVal > 220) {
          // Soft edge
          const alpha = Math.round(((246 - minVal) / (246 - 220)) * 255);
          logoDark.data[dstIdx] = 255;
          logoDark.data[dstIdx + 1] = 255;
          logoDark.data[dstIdx + 2] = 255;
          logoDark.data[dstIdx + 3] = Math.max(0, Math.min(255, alpha));
        } else {
          // Solid white
          logoDark.data[dstIdx] = 255;
          logoDark.data[dstIdx + 1] = 255;
          logoDark.data[dstIdx + 2] = 255;
          logoDark.data[dstIdx + 3] = 255;
        }
      }
    }
  }
}

fs.writeFileSync('public/arya-logo-white.png', PNG.sync.write(logoDark));
fs.writeFileSync('src/assets/img/arya-logo-white.png', PNG.sync.write(logoDark));
console.log('Saved arya-logo-white.png');
