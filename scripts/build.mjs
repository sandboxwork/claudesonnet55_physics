import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { Script } from 'node:vm';

const source = new URL('../physics-sim.html', import.meta.url);
const output = new URL('../dist/', import.meta.url);
const html = await readFile(source, 'utf8');

// Check the embedded JavaScript before publishing the standalone page.
for (const [index, match] of [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
  new Script(match[1], { filename: `physics-sim.html:script-${index + 1}` });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(new URL('index.html', output), html);
await writeFile(new URL('.nojekyll', output), '');

console.log('Built dist/index.html for GitHub Pages.');
