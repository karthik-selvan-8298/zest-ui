/**
 * Ambient declaration for side-effect stylesheet imports (`import './X.css'`).
 *
 * TypeScript 6 enables `noUncheckedSideEffectImports` by default, which
 * requires every side-effect import to resolve to a module. Component CSS is
 * copied verbatim into dist by scripts/copy-css.mjs and resolved by the
 * consumer's bundler, so it only needs to type-check here. The imports are
 * stripped from emitted .d.ts files (scripts/fix-esm.mjs), so consumers never
 * see this declaration.
 */
declare module '*.css';
