/**
 * Post-build ESM fixer:
 * 1. Rewrites extensionless relative specifiers in dist to explicit paths
 *    ('./Button' → './Button.js', './forms' → './forms/index.js') so the
 *    output is valid native Node ESM and node16-resolution safe. Covers both
 *    `from '…'` / `import '…'` statements and the inline `import("…").Type`
 *    references TypeScript emits in declaration files.
 * 2. Blanks side-effect CSS imports in .d.ts files. TypeScript preserves
 *    `import './X.css'` in declarations, where they carry no type meaning and
 *    fail resolution for consumers / are-the-types-wrong. The line is kept
 *    (replaced with an empty one) so declaration maps stay aligned. Runtime
 *    .js files keep their CSS imports.
 * 3. Prepends 'use client' to component modules (everything except tokens/
 *    and icons/, which stay server-component-safe) so Next.js App Router
 *    consumers can import from server components without wrappers.
 *
 * Usage: node scripts/fix-esm.mjs dist
 */
import { readFileSync, writeFileSync, globSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const dist = process.argv[2] ?? 'dist';

const SPECIFIER = /(from\s+|import\s+|export\s+\*\s+from\s+)(['"])(\.\.?\/[^'"]+)\2/g;
const TYPE_IMPORT = /(import\()(['"])(\.\.?\/[^'"]+)\2(\))/g;
const CSS_SIDE_EFFECT = /^import\s+['"][^'"]+\.css['"];?[ \t]*$/gm;

function fixSpecifier(file, spec) {
  if (/\.(js|css|json|mjs)$/.test(spec)) return spec;
  const base = resolve(dirname(file), spec);
  if (existsSync(base) && statSync(base).isDirectory()) return `${spec}/index.js`;
  return `${spec}.js`;
}

let rewritten = 0;
let stripped = 0;
for (const file of globSync(join(dist, '**/*.{js,d.ts}'))) {
  const source = readFileSync(file, 'utf8');
  let next = source
    .replace(SPECIFIER, (match, lead, quote, spec) => {
      const fixed = fixSpecifier(file, spec);
      if (fixed !== spec) rewritten += 1;
      return `${lead}${quote}${fixed}${quote}`;
    })
    .replace(TYPE_IMPORT, (match, lead, quote, spec, tail) => {
      const fixed = fixSpecifier(file, spec);
      if (fixed !== spec) rewritten += 1;
      return `${lead}${quote}${fixed}${quote}${tail}`;
    });
  if (file.endsWith('.d.ts')) {
    next = next.replace(CSS_SIDE_EFFECT, () => {
      stripped += 1;
      return '';
    });
  }
  if (next !== source) writeFileSync(file, next);
}

let bannered = 0;
for (const file of globSync(join(dist, '**/*.js'))) {
  const rel = file.replace(/\\/g, '/');
  if (rel.includes('/tokens/') || rel.includes('/icons/')) continue;
  const source = readFileSync(file, 'utf8');
  if (source.startsWith("'use client'")) continue;
  // Same-line prepend keeps sourcemap line numbers intact.
  writeFileSync(file, `'use client';${source}`);
  bannered += 1;
}

console.log(
  `fix-esm: ${rewritten} specifiers fixed, ${stripped} css imports stripped from .d.ts, ${bannered} files bannered with 'use client'`
);
