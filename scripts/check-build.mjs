import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
for (const name of ['index.html', 'bundle.js', 'styles.css']) {
  assert((await stat(new URL(name, output))).isFile(), `Missing file: ${name}`);
}
for (const name of ['documents', 'reports', 'assets']) {
  assert((await stat(new URL(name, output))).isDirectory(), `Missing folder: ${name}`);
}
const html = await readFile(new URL('index.html', output), 'utf8');
assert(html.includes('./bundle.js'), 'JavaScript must use a relative deployment path');
assert(html.includes('./styles.css'), 'CSS must use a relative deployment path');
assert(!html.includes('/src/'), 'Source entry must be replaced by the build');
for (const file of ['documents/getting-started.md', 'reports/build-overview.json', 'assets/mark.svg']) {
  await access(new URL(file, output));
}
JSON.parse(await readFile(new URL('reports/build-overview.json', output), 'utf8'));
console.log('Build verified: required files, folders, sample resources, and relative entry URLs.');
