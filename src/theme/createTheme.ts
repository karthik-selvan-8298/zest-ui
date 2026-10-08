import type { ThemeColors, ZestTheme, ZestThemeOptions } from './types';

/** Tones that accept a `ToneOverride` (mirrors `ZestColor`). */
const toneKeys = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
  'neutral',
] as const;

/** Maps a `ThemeColors` object onto the semantic `--zest-color-*` variables. */
function colorVars(colors: ThemeColors | undefined): Record<string, string> {
  if (!colors) return {};
  const vars: Record<string, string> = {};
  for (const tone of toneKeys) {
    const override = colors[tone];
    if (!override) continue;
    if (override.main) vars[`--zest-color-${tone}`] = override.main;
    if (override.hover) vars[`--zest-color-${tone}-hover`] = override.hover;
    if (override.active) vars[`--zest-color-${tone}-active`] = override.active;
    if (override.contrast) vars[`--zest-color-${tone}-contrast`] = override.contrast;
    if (override.subtleText) vars[`--zest-color-${tone}-subtle-text`] = override.subtleText;
  }
  if (colors.background) vars['--zest-color-background'] = colors.background;
  if (colors.backgroundNeutral) vars['--zest-color-background-neutral'] = colors.backgroundNeutral;
  if (colors.surface) vars['--zest-color-surface'] = colors.surface;
  if (colors.textPrimary) vars['--zest-color-text-primary'] = colors.textPrimary;
  if (colors.textSecondary) vars['--zest-color-text-secondary'] = colors.textSecondary;
  if (colors.textDisabled) vars['--zest-color-text-disabled'] = colors.textDisabled;
  if (colors.border) vars['--zest-color-border'] = colors.border;
  if (colors.focusRing) vars['--zest-color-focus-ring'] = colors.focusRing;
  return vars;
}

/**
 * Creates a Zest theme: a set of semantic CSS-variable overrides applied by
 * `<ZestProvider>` (app-wide) or `<Theme>` (one subtree). Components never
 * change — themes only move token values.
 *
 * ```ts
 * const theme = createTheme({
 *   colors: { primary: { main: '#0E9F6E', hover: '#057A55' } },
 *   radius: { md: '8px' },
 *   cssVars: { '--zest-button-height-md': '40px' },
 * });
 * ```
 */
export function createTheme(options: ZestThemeOptions = {}): ZestTheme {
  const cssVars: Record<string, string> = { ...colorVars(options.colors) };
  const darkCssVars: Record<string, string> = { ...colorVars(options.darkColors) };

  if (options.typography?.fontFamily) {
    cssVars['--zest-font-family-sans'] = options.typography.fontFamily;
  }
  if (options.typography?.fontFamilyMono) {
    cssVars['--zest-font-family-mono'] = options.typography.fontFamilyMono;
  }
  for (const [key, value] of Object.entries(options.radius ?? {})) {
    if (value) cssVars[`--zest-radius-${key}`] = value;
  }
  Object.assign(cssVars, options.cssVars);
  Object.assign(darkCssVars, options.darkCssVars);

  return { cssVars, darkCssVars, options };
}
