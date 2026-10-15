import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const out = new URL('../public/assets/characters/', import.meta.url);
await mkdir(out, { recursive: true });
const source = new URL('../image.png', import.meta.url);
await copyFile(source, new URL('original-character-sheet.png', out));
const { data, info } = await sharp(await import('node:fs/promises').then(fs => fs.readFile(source))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const visited = new Uint8Array(width * height);
const owners = new Int8Array(width * height).fill(-1);
const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
// Use visible pixels to identify separate shapes. Near-transparent pixels can
// otherwise connect two characters into one shape in an updated sprite sheet.
// The original pixels, including all soft edges, are retained in the output.
const coreAlpha = 16;
for (let start = 0; start < visited.length; start++) {
  if (visited[start] || data[start * 4 + 3] < coreAlpha) continue;
  const pixels = [start];
  visited[start] = 1;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let j = 0; j < pixels.length; j++) {
    const p = pixels[j], x = p % width, y = Math.floor(p / width);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    for (const [dx, dy] of neighbors) {
      const nx = x + dx, ny = y + dy, n = ny * width + nx;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height || visited[n] || data[n * 4 + 3] < coreAlpha) continue;
      visited[n] = 1; pixels.push(n);
    }
  }
  const col = Math.min(2, Math.floor(((minX + maxX) / 2) / (width / 3)));
  const row = Math.min(2, Math.floor(((minY + maxY) / 2) / (height / 3)));
  for (const p of pixels) owners[p] = row * 3 + col;
}

// Grow all nine masks together into their faint edge pixels. A faint bridge
// gets split between its nearest shapes instead of joining two expressions.
const queue = new Int32Array(width * height);
let head = 0, tail = 0;
for (let p = 0; p < owners.length; p++) if (owners[p] !== -1) queue[tail++] = p;
while (head < tail) {
  const p = queue[head++], x = p % width, y = Math.floor(p / width);
  for (const [dx, dy] of neighbors) {
    const nx = x + dx, ny = y + dy, n = ny * width + nx;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height || owners[n] !== -1 || !data[n * 4 + 3]) continue;
    owners[n] = owners[p];
    queue[tail++] = n;
  }
}
const groups = Array.from({ length: 9 }, () => ({ pixels: [], minX: width, minY: height, maxX: 0, maxY: 0, corePixels: 0 }));
for (let p = 0; p < owners.length; p++) {
  if (!data[p * 4 + 3]) continue;
  const x = p % width, y = Math.floor(p / width);
  const owner = owners[p] === -1 ? Math.min(2, Math.floor(y / (height / 3))) * 3 + Math.min(2, Math.floor(x / (width / 3))) : owners[p];
  const group = groups[owner];
  group.pixels.push(p);
  group.minX = Math.min(group.minX, x); group.maxX = Math.max(group.maxX, x);
  group.minY = Math.min(group.minY, y); group.maxY = Math.max(group.maxY, y);
  if (data[p * 4 + 3] >= coreAlpha) group.corePixels++;
}
if (groups.some(group => group.corePixels < 1000)) throw new Error('Expected nine visible expressions in a 3×3 sheet; inspect the updated source before exporting.');
const names = ['crying', 'confused', 'thinking', 'confident', 'suspicious', 'unimpressed', 'laughing', 'love', 'rocket'];
const manifest = [];
for (let i = 0; i < 9; i++) {
  const buffer = Buffer.alloc(width * height * 4);
  const group = groups[i];
  const { minX: left, minY: top, maxX: right, maxY: bottom } = group;
  for (const p of group.pixels) data.copy(buffer, p * 4, p * 4, p * 4 + 4);
  await sharp(buffer, { raw: { width, height, channels: 4 } }).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).extend({ top: 8, bottom: 8, left: 8, right: 8, background: '#00000000' }).webp({ lossless: true, effort: 6 }).toFile(fileURLToPath(new URL(`${names[i]}.webp`, out)));
  manifest.push({ name: names[i], bounds: [left, top, right, bottom], pixels: group.pixels.length });
}
await writeFile(new URL('manifest.json', out), JSON.stringify(manifest, null, 2));
console.log('Prepared nine lossless transparent expressions:', manifest);
