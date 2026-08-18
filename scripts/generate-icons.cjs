// Generates minimal PWA PNG icons without external dependencies.
// Uses pure Node.js Buffer to write valid PNG files.
// Run: node scripts/generate-icons.cjs
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PUBLIC = path.join(__dirname, '..', 'public');

// ─── Minimal PNG encoder ───────────────────────────────────────────────────
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })());
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.concat([typeB, data]);
  const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeB, data, crcVal]);
}

function encodePNG(width, height, pixels) {
  // pixels: Uint8Array of RGBA values, row by row
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB (we'll use RGB, no alpha for simplicity, then add alpha)
  ihdrData[9] = 6;  // color type: RGBA
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const ihdr = chunk('IHDR', ihdrData);

  // Build raw scanlines (filter byte 0 = None prepended to each row)
  const rowSize = width * 4;
  const raw = Buffer.alloc((rowSize + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (rowSize + 1)] = 0; // filter type None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = y * (rowSize + 1) + 1 + x * 4;
      raw[dst]     = pixels[src];
      raw[dst + 1] = pixels[src + 1];
      raw[dst + 2] = pixels[src + 2];
      raw[dst + 3] = pixels[src + 3];
    }
  }
  const compressed = zlib.deflateSync(raw);
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));
  return Buffer.concat([signature, ihdr, idat, iend]);
}

// ─── Icon renderer ─────────────────────────────────────────────────────────
function hexToRGBA(hex, alpha = 255) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16), alpha];
}

function setPixel(pixels, width, x, y, r, g, b, a) {
  if (x < 0 || x >= width || y < 0 || y >= width) return;
  const i = (y * width + x) * 4;
  // Alpha blend over existing
  const sa = a / 255;
  const da = pixels[i+3] / 255;
  const oa = sa + da * (1 - sa);
  if (oa === 0) return;
  pixels[i]   = Math.round((r * sa + pixels[i]   * da * (1-sa)) / oa);
  pixels[i+1] = Math.round((g * sa + pixels[i+1] * da * (1-sa)) / oa);
  pixels[i+2] = Math.round((b * sa + pixels[i+2] * da * (1-sa)) / oa);
  pixels[i+3] = Math.round(oa * 255);
}

// Anti-aliased line drawing (Xiaolin Wu)
function drawLine(pixels, width, x0, y0, x1, y1, r, g, b, thickness) {
  const steps = Math.max(Math.abs(x1-x0), Math.abs(y1-y0)) * 4;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1-x0)*t;
    const y = y0 + (y1-y0)*t;
    // Draw thick line by spreading pixels
    const half = Math.ceil(thickness / 2);
    for (let dx = -half; dx <= half; dx++) {
      for (let dy = -half; dy <= half; dy++) {
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= thickness/2) {
          const alpha = Math.round(255 * Math.max(0, 1 - Math.max(0, dist - thickness/2 + 0.5)));
          setPixel(pixels, width, Math.round(x+dx), Math.round(y+dy), r, g, b, alpha);
        }
      }
    }
  }
}

// Draw arc via parametric
function drawArc(pixels, width, x0, y0, x1, y1, cx, cy, r, g, b, thickness, steps = 200) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Cubic bezier: p0 -> cp1 -> cp2 -> p1
    const bx = x0 + (x1-x0)*t;
    const by = y0 + (y1-y0)*t + Math.sin(t * Math.PI) * (cy - (y0+y1)/2) * 0.5;
    pts.push([bx, by]);
  }
  for (let i = 0; i < pts.length - 1; i++) {
    drawLine(pixels, width, pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1], r, g, b, thickness);
  }
}

function drawBezier(pixels, width, x0, y0, cx1, cy1, cx2, cy2, x1, y1, r, g, b, thickness, steps = 150) {
  let prevX = x0, prevY = y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt*mt*mt*x0 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x1;
    const y = mt*mt*mt*y0 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y1;
    drawLine(pixels, width, prevX, prevY, x, y, r, g, b, thickness);
    prevX = x; prevY = y;
  }
}

function generateIcon(size, maskable) {
  const pixels = new Uint8Array(size * size * 4);

  // Background fill
  const bg = hexToRGBA('#070d14');
  for (let i = 0; i < size * size; i++) {
    pixels[i*4]   = bg[0];
    pixels[i*4+1] = bg[1];
    pixels[i*4+2] = bg[2];
    pixels[i*4+3] = 255;
  }

  // Rounded rect mask for non-maskable
  if (!maskable) {
    const radius = size * 0.22;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Check if outside rounded rect
        let outside = false;
        if (x < radius && y < radius) {
          const dx = radius - x, dy = radius - y;
          outside = Math.sqrt(dx*dx+dy*dy) > radius;
        } else if (x > size-radius && y < radius) {
          const dx = x-(size-radius), dy = radius-y;
          outside = Math.sqrt(dx*dx+dy*dy) > radius;
        } else if (x < radius && y > size-radius) {
          const dx = radius-x, dy = y-(size-radius);
          outside = Math.sqrt(dx*dx+dy*dy) > radius;
        } else if (x > size-radius && y > size-radius) {
          const dx = x-(size-radius), dy = y-(size-radius);
          outside = Math.sqrt(dx*dx+dy*dy) > radius;
        }
        if (outside) {
          const i = (y*size+x)*4;
          pixels[i+3] = 0; // transparent
        }
      }
    }
  }

  const [cr,cg,cb] = [6, 182, 212]; // #06b6d4 cyan
  const cx = size/2;
  const cy = size/2;
  const scale = size/512;
  const lw = Math.max(4, Math.round(18 * scale));
  const lwHeavy = Math.max(5, Math.round(22 * scale));

  // Spine
  drawLine(pixels, size, cx, cy - 98*scale, cx, cy + 98*scale, cr, cg, cb, lw);

  // Left page arcs (cubic bezier)
  drawBezier(pixels, size,
    cx, cy - 98*scale,
    cx - 8*scale, cy - 108*scale,
    cx - 84*scale, cy - 88*scale,
    cx - 84*scale, cy - 38*scale,
    cr, cg, cb, lw
  );
  drawBezier(pixels, size,
    cx - 84*scale, cy - 38*scale,
    cx - 84*scale, cy + 58*scale,
    cx - 36*scale, cy + 82*scale,
    cx, cy + 98*scale,
    cr, cg, cb, lw
  );

  // Right page arcs
  drawBezier(pixels, size,
    cx, cy - 98*scale,
    cx + 8*scale, cy - 108*scale,
    cx + 84*scale, cy - 88*scale,
    cx + 84*scale, cy - 38*scale,
    cr, cg, cb, lw
  );
  drawBezier(pixels, size,
    cx + 84*scale, cy - 38*scale,
    cx + 84*scale, cy + 58*scale,
    cx + 36*scale, cy + 82*scale,
    cx, cy + 98*scale,
    cr, cg, cb, lw
  );

  // Left page horizontal lines
  drawLine(pixels, size, cx-72*scale, cy-28*scale, cx-10*scale, cy-30*scale, cr, cg, cb, Math.max(3, Math.round(12*scale)));
  drawLine(pixels, size, cx-74*scale, cy-4*scale,  cx-12*scale, cy-8*scale,  cr, cg, cb, Math.max(3, Math.round(12*scale)));
  drawLine(pixels, size, cx-76*scale, cy+20*scale, cx-14*scale, cy+14*scale, cr, cg, cb, Math.max(3, Math.round(12*scale)));

  // Checkmark on right page
  drawLine(pixels, size, cx+10*scale, cy+24*scale, cx+30*scale, cy+50*scale, cr, cg, cb, lwHeavy);
  drawLine(pixels, size, cx+30*scale, cy+50*scale, cx+72*scale, cy-8*scale,  cr, cg, cb, lwHeavy);

  return pixels;
}

function main() {
  const configs = [
    { size: 192,  name: 'icon-192.png',        maskable: false },
    { size: 512,  name: 'icon-512.png',        maskable: false },
    { size: 512,  name: 'icon-maskable.png',   maskable: true  },
    { size: 180,  name: 'apple-touch-icon.png', maskable: false },
  ];

  for (const { size, name, maskable } of configs) {
    console.log(`Generating ${name} (${size}×${size}, maskable=${maskable})...`);
    const pixels = generateIcon(size, maskable);
    const png = encodePNG(size, size, pixels);
    fs.writeFileSync(path.join(PUBLIC, name), png);
    console.log(`  ✅ ${name} — ${(png.length/1024).toFixed(1)} KB`);
  }
}

main();
