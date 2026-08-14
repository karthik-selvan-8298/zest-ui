/**
 * Primitive color scales, extracted and normalized from the Sigma design reference.
 *
 * Mapping rule (mandatory): Sigma *Secondary* → Zest *Primary* (violet).
 * Sigma Primary (green) is mapped to Zest Secondary so the full palette stays usable.
 *
 * Five stops per brand color (100/300/500/700/900) — the Sigma sheets only ever
 * use lighter/light/main/dark/darker, so a denser scale would be dead weight.
 */
export const gray = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
} as const;

/** Sigma Secondary → Zest Primary. */
export const primary = {
  100: 'hsl(258 84% 96%)',
  300: 'hsl(258 84% 68%)',
  500: 'hsl(258 84% 55%)',
  700: 'hsl(258 84% 42%)',
  900: 'hsl(258 84% 30%)',
} as const;

/** Sigma Primary (green) → Zest Secondary. */
export const secondary = {
  100: '#C8FAD6',
  300: '#5BE49B',
  500: '#00A76F',
  700: '#007867',
  900: '#004B50',
} as const;

export const info = {
  100: '#CAFDF5',
  300: '#61F3F3',
  500: '#00B8D9',
  700: '#006C9C',
  900: '#003768',
} as const;

export const success = {
  100: '#D3FCD2',
  300: '#77ED8B',
  500: '#22C55E',
  700: '#118D57',
  900: '#065E49',
} as const;

export const warning = {
  100: '#FFF5CC',
  300: '#FFD666',
  500: '#FFAB00',
  700: '#B76E00',
  900: '#7A4100',
} as const;

export const error = {
  100: '#FFE9D5',
  300: '#FFAC82',
  500: '#FF5630',
  700: '#B71D18',
  900: '#7A0916',
} as const;

export const common = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

/** RGB channel of gray-500, used by the Sigma shadow/border alpha language. */
export const grayChannel = '100 116 139';

export type ColorScale = typeof primary;
export type GrayScale = typeof gray;
