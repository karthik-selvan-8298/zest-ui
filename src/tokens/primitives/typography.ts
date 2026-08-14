/**
 * Type primitives. Roboto is the Zest default (via @fontsource/roboto).
 * The Sigma scale is normalized to Roboto's native weights: 400 / 500 / 700.
 */
export const fontFamily = {
  sans: "'Roboto', -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  mono: "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

export const fontSize = {
  xs: '0.75rem', // 12
  sm: '0.875rem', // 14
  md: '1rem', // 16
  lg: '1.125rem', // 18
  xl: '1.25rem', // 20
  '2xl': '1.5rem', // 24
  '3xl': '2rem', // 32
  '4xl': '2.5rem', // 40
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.6,
} as const;
