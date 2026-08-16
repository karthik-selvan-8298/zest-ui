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
  50: '#FCFDFD',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#1C252E',
  900: '#141A21',
} as const;

/** Zest brand violet (#662CED main) — overrides the Minimals secondary hue. */
export const primary = {
  100: '#F1ECFD',
  300: '#9269F2',
  500: '#662CED',
  700: '#4711C5',
  900: '#330C8D',
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
export const grayChannel = '145 158 171';
