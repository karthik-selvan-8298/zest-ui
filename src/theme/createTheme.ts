import type { ThemeColors, ZestTheme, ZestThemeOptions } from './types';

const toneKeys = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
  'neutral',
] as const;

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
 * `<ZestProvider>`. Components never change — themes only move token values.
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
    cssVars[`--zest-radius-${key}`] = value as string;
  }
  Object.assign(cssVars, options.cssVars);
  Object.assign(darkCssVars, options.darkCssVars);

  return { cssVars, darkCssVars, options };
}
