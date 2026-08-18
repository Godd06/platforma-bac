// Script for generating PNG icons from SVG using Canvas API
// Run with: node scripts/generate-icons.js

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function drawIcon(ctx, size, maskable = false) {
  const padding = maskable ? size * 0.15 : size * 0.1;
  const bg = '#070d14';
  const cyan = '#06b6d4';

  // Background
  ctx.fillStyle = bg;
  if (maskable) {
    ctx.fillRect(0, 0, size, size);
  } else {
    // Rounded rect for non-maskable
    const r = size * 0.22;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  }

  // Draw book + checkmark icon
  const cx = size / 2;
  const cy = size / 2;
  const iconSize = size - padding * 2;
  const lw = size * 0.045;

  ctx.strokeStyle = cyan;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Book spine (vertical center line)
  ctx.beginPath();
  ctx.moveTo(cx, cy - iconSize * 0.38);
  ctx.lineTo(cx, cy + iconSize * 0.38);
  ctx.stroke();

  // Left page top arc
  ctx.beginPath();
  ctx.moveTo(cx, cy - iconSize * 0.38);
  ctx.bezierCurveTo(
    cx - iconSize * 0.05, cy - iconSize * 0.42,
    cx - iconSize * 0.42, cy - iconSize * 0.35,
    cx - iconSize * 0.42, cy - iconSize * 0.1
  );
  ctx.stroke();

  // Left page bottom
  ctx.beginPath();
  ctx.moveTo(cx - iconSize * 0.42, cy - iconSize * 0.1);
  ctx.bezierCurveTo(
    cx - iconSize * 0.42, cy + iconSize * 0.18,
    cx - iconSize * 0.1, cy + iconSize * 0.32,
    cx, cy + iconSize * 0.38
  );
  ctx.stroke();

  // Right page top arc
  ctx.beginPath();
  ctx.moveTo(cx, cy - iconSize * 0.38);
  ctx.bezierCurveTo(
    cx + iconSize * 0.05, cy - iconSize * 0.42,
    cx + iconSize * 0.42, cy - iconSize * 0.35,
    cx + iconSize * 0.42, cy - iconSize * 0.1
  );
  ctx.stroke();

  // Right page bottom
  ctx.beginPath();
  ctx.moveTo(cx + iconSize * 0.42, cy - iconSize * 0.1);
  ctx.bezierCurveTo(
    cx + iconSize * 0.42, cy + iconSize * 0.18,
    cx + iconSize * 0.1, cy + iconSize * 0.32,
    cx, cy + iconSize * 0.38
  );
  ctx.stroke();

  // Checkmark on right page
  ctx.lineWidth = lw * 1.2;
  ctx.beginPath();
  ctx.moveTo(cx + iconSize * 0.08, cy + iconSize * 0.02);
  ctx.lineTo(cx + iconSize * 0.19, cy + iconSize * 0.16);
  ctx.lineTo(cx + iconSize * 0.38, cy - iconSize * 0.15);
  ctx.stroke();
}

async function generateIcons() {
  try {
    const sizes = [
      { size: 192, name: 'icon-192.png', maskable: false },
      { size: 512, name: 'icon-512.png', maskable: false },
      { size: 512, name: 'icon-maskable.png', maskable: true },
    ];

    for (const { size, name, maskable } of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      drawIcon(ctx, size, maskable);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join(PUBLIC, name), buffer);
      console.log(`✅ Generated ${name} (${size}x${size}, maskable=${maskable})`);
    }

    // Apple touch icon (180x180)
    const atCanvas = createCanvas(180, 180);
    drawIcon(atCanvas.getContext('2d'), 180, false);
    fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), atCanvas.toBuffer('image/png'));
    console.log('✅ Generated apple-touch-icon.png (180x180)');

  } catch (err) {
    console.error('Error generating icons:', err.message);
    process.exit(1);
  }
}

generateIcons();
