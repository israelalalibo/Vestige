import sharp from 'sharp';
import { mkdir } from 'fs/promises';

const SRC = 'docs/screenshots/vestige logo.jpeg';
const OUT = 'public/logo.png';

await mkdir('public', { recursive: true });

// Trim the surrounding white border, then export a tight PNG.
const img = sharp(SRC).trim({ threshold: 12 });
const buf = await img.png().toBuffer();
const meta = await sharp(buf).metadata();
await sharp(buf).toFile(OUT);

console.log(`Wrote ${OUT} — ${meta.width}x${meta.height}`);
