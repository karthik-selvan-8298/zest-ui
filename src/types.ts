/** Tone palette shared by all tonal components. */
export type ZestColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type ZestSize = 'sm' | 'md' | 'lg';

/**
 * Base UI parts accept `className` as a state-function; Zest components expose
 * a plain string API. Narrows a Base UI prop set accordingly.
 */
export type WithClassName<P> = Omit<P, 'className'> & { className?: string };
