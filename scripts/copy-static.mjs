import { cp } from 'node:fs/promises';

for (const directory of ['documents', 'reports', 'assets']) {
  await cp(new URL(`../${directory}/`, import.meta.url), new URL(`../dist/${directory}/`, import.meta.url), { recursive: true });
}
