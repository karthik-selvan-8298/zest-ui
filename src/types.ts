import type { ReactNode } from 'react';

/** Tone palette shared by all tonal components. */
export type ZestColor =
  'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

/** Control size scale shared by buttons, toggles and fields. */
export type ZestSize = 'sm' | 'md' | 'lg';

/**
 * Base UI parts accept `className` as a state-function; Zest components expose
 * a plain string API. Narrows a Base UI prop set accordingly.
 */
export type WithClassName<P> = Omit<P, 'className'> & { className?: string };

/**
 * Enforces an accessible name at the type level for controls that have no
 * intrinsic text (progress bars, sliders, meters): at least one of a visible
 * `label`, `aria-label`, or `aria-labelledby` must be supplied.
 *
 * ```ts
 * type ProgressProps = ProgressBaseProps & AccessibleName;
 * ```
 */
export type AccessibleName =
  | { label: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: ReactNode; 'aria-label'?: string; 'aria-labelledby': string };
