/** Theme customization API — every field optional; values become CSS variable overrides. */

export interface ToneOverride {
  main?: string;
  hover?: string;
  active?: string;
  contrast?: string;
  /** Text color used on subtle (alpha-tinted) backgrounds of this tone. */
  subtleText?: string;
}

export interface ThemeColors {
  primary?: ToneOverride;
  secondary?: ToneOverride;
  success?: ToneOverride;
  warning?: ToneOverride;
  error?: ToneOverride;
  info?: ToneOverride;
  neutral?: ToneOverride;
  background?: string;
  backgroundNeutral?: string;
  surface?: string;
  textPrimary?: string;
  textSecondary?: string;
  textDisabled?: string;
  border?: string;
  focusRing?: string;
}

export interface ThemeTypography {
  fontFamily?: string;
  fontFamilyMono?: string;
}

export interface ThemeRadius {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}

export interface ZestThemeOptions {
  colors?: ThemeColors;
  /** Same shape as `colors`, applied only in dark mode. */
  darkColors?: ThemeColors;
  typography?: ThemeTypography;
  radius?: ThemeRadius;
  /**
   * Escape hatch: raw `--zest-*` variable overrides, applied light-mode-wide.
   * Keys must include the `--zest-` prefix.
   */
  cssVars?: Record<string, string>;
  /** Raw variable overrides applied only in dark mode. */
  darkCssVars?: Record<string, string>;
}

export interface ZestTheme {
  /** Resolved light-mode variable map. */
  cssVars: Record<string, string>;
  /** Resolved dark-mode variable map. */
  darkCssVars: Record<string, string>;
  /** The options the theme was created from. */
  options: ZestThemeOptions;
}
