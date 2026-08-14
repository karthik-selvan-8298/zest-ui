/** Spacing scale — 4px base, normalized from the Sigma spacing audit. */
export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

/** Radius scale — Sigma uses an 8px base with 16px cards. */
export const radius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '999px',
} as const;

/** Motion system. */
export const duration = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
} as const;

export const easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

/** Breakpoints (px). CSS media queries can't read custom properties, so JS is the source of truth. */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** Layering scale. */
export const zIndex = {
  appbar: 1100,
  drawer: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;
