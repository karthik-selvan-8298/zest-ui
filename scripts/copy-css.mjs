/**
 * Copies .css files from src to dist preserving structure, so that compiled
 * JS `import './X.css'` statements resolve. Usage: node copy-css.mjs <src> <dist>
 */
import { cpSync, globSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const [src = 'src', dist = 'dist'] = process.argv.slice(2);
const files = globSync(join(src, '**/*.css'));
for (const file of files) {
  const target = join(dist, relative(src, file));
  cpSync(file, target);
}
console.log(`copied ${files.length} css file(s) → ${dist}`);
