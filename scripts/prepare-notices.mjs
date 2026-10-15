import { mkdir, readFile, writeFile } from 'node:fs/promises';

// These packages are embedded in the browser bundle. Preserve their installed
// license texts verbatim without assigning a license to this project's assets.
const packages = ['react', 'react-dom', 'scheduler'];
const sections = await Promise.all(packages.map(async name => {
  const root = new URL(`../node_modules/${name}/`, import.meta.url);
  const info = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const license = await readFile(new URL('LICENSE', root), 'utf8');
  return `${name} ${info.version}\n${'='.repeat(72)}\n\n${license.trimEnd()}\n`;
}));
const text = 'Third-party software notices\n\n' +
  'The following libraries are included in the browser JavaScript bundle.\n' +
  'These license notices apply to those libraries. They do not grant a new\n' +
  'license to the application, photographs, or character artwork.\n' +
  'Photograph licenses are documented in assets/destinations/CREDITS.md.\n\n' + sections.join('\n');
const output = new URL('../public/THIRD_PARTY_NOTICES.txt', import.meta.url);
await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(output, text);
console.log('Prepared third-party notices for React, React DOM, and Scheduler.');
