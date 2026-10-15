import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { photoSources } from './photo-sources.mjs';

const out = 'public/assets/destinations';
const cache = '.qa/destination-originals';
await mkdir(out, { recursive: true });
await mkdir(cache, { recursive: true });
const headers = { 'User-Agent': 'DiscoverYourSeoul/1.0 (educational travel quiz; Wikimedia Commons photo attribution)' };
const acceptedLicenses = new Set(['CC0', 'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 3.0', 'CC BY-SA 4.0']);
const plain = html => JSDOM.fragment(html ?? '').textContent.trim();

async function get(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, { headers });
    if (response.ok) return response;
    if (![429, 503].includes(response.status) || attempt === 3) throw new Error(`HTTP ${response.status}: ${url}`);
    const delay = Math.max(3, Number(response.headers.get('retry-after')) || 3) * 1000;
    console.log(`Rate limited; retrying after ${delay / 1000}s`);
    await new Promise(resolve => setTimeout(resolve, Math.min(delay, 15000)));
  }
}

let metadata;
try {
  metadata = JSON.parse(await readFile(`${cache}/metadata.json`, 'utf8'));
  if (!photoSources.every(item => Object.values(metadata.query.pages).some(page => page.title === `File:${item.file}`))) metadata = undefined;
} catch { /* Fetch a fresh snapshot below when no matching cache exists. */ }
if (!metadata) {
  const params = new URLSearchParams({ action: 'query', titles: photoSources.map(p => `File:${p.file}`).join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata|sha1|timestamp', iiurlwidth: '1280', format: 'json' });
  const response = await get(`https://commons.wikimedia.org/w/api.php?${params}`);
  metadata = await response.json();
  if (!metadata.query?.pages) throw new Error(JSON.stringify(metadata));
  await writeFile(`${cache}/metadata.json`, JSON.stringify(metadata, null, 2));
}
const pages = Object.values(metadata.query.pages);
const manifest = {}, evidence = [];
for (const item of photoSources) {
  const page = pages.find(p => p.title.replaceAll('_', ' ') === `File:${item.file}`.replaceAll('_', ' '));
  const info = page?.imageinfo?.[0], meta = info?.extmetadata;
  if (!info || !meta) throw new Error(`Missing source: ${item.file}`);
  const license = plain(meta.LicenseShortName?.value), author = plain(meta.Artist?.value), licenseUrl = meta.LicenseUrl?.value?.replace(/^http:/, 'https:');
  if (!acceptedLicenses.has(license) || !author || !licenseUrl?.startsWith('https://creativecommons.org/')) throw new Error(`Unapproved or incomplete license metadata: ${item.file}: ${license}`);
  if (meta.Restrictions?.value) throw new Error(`Additional restrictions need review: ${item.file}: ${meta.Restrictions.value}`);
  let bytes;
  const cachedImage = `${cache}/${item.id}-${info.sha1}`;
  try { bytes = await readFile(cachedImage); }
  catch {
    const response = await get(info.thumburl ?? info.url);
    if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Not an image: ${item.file}`);
    bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(cachedImage, bytes);
  }
  let image = sharp(bytes).rotate();
  if (item.crop) {
    const dimensions = await sharp(bytes).metadata();
    const swap = [5, 6, 7, 8].includes(dimensions.orientation);
    const width = swap ? dimensions.height : dimensions.width;
    const height = swap ? dimensions.width : dimensions.height;
    image = image.extract({ left: Math.round(width * item.crop.left), top: Math.round(height * item.crop.top), width: Math.round(width * item.crop.width), height: Math.round(height * item.crop.height) });
  }
  const large = await image.clone().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer({ resolveWithObject: true });
  await writeFile(`${out}/${item.id}.webp`, large.data);
  await image.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(`${out}/${item.id}-small.webp`);
  const changes = item.crop ? 'Cropped to show storefront signs and exclude foreground pedestrians; resized and converted to WebP; cropped to fit the card when displayed.' : 'Resized and converted to WebP; cropped to fit the card when displayed.';
  const photo = { src: `./assets/destinations/${item.id}.webp`, smallSrc: `./assets/destinations/${item.id}-small.webp`, width: large.info.width, height: large.info.height, alt: item.alt, caption: item.caption ?? '', position: item.position, title: page.title.replace(/^File:/, ''), sourceUrl: info.descriptionurl, author, license, licenseUrl, changes };
  manifest[item.spot] = photo;
  evidence.push({ spot: item.spot, retrievedOn: '2026-10-16', ...photo, commonsPageId: page.pageid, originalUrl: info.url, downloadedUrl: info.thumburl ?? info.url, originalSha1: info.sha1, originalTimestamp: info.timestamp, extmetadata: meta });
  // Save each completed asset so an interrupted download can resume safely.
  await writeFile('src/photo-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(`${out}/sources.json`, JSON.stringify(evidence, null, 2) + '\n');
  console.log(`${item.id}: ${license}; ${author}; ${Math.round(large.data.length / 1024)} KB`);
}
await writeFile(`${out}/CREDITS.md`, '# Destination photograph credits\n\n' +
  'Downloaded from Wikimedia Commons on 2026-10-16. Each photo is distributed under its stated license. ShareAlike terms apply to the corresponding photo adaptations.\n\n' +
  evidence.map(p => `## ${p.spot}\n\n- Title: [${p.title}](${p.sourceUrl})\n- Author: ${p.author}\n- License: [${p.license}](${p.licenseUrl})\n- Changes: ${p.changes}\n- Local file: ${p.src.split('/').at(-1)}\n${p.caption ? `- Context: ${p.caption}\n` : ''}`).join('\n'));
console.log(`Prepared ${evidence.length} licensed destination photographs.`);
