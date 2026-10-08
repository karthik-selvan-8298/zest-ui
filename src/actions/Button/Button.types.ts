import type * as React from 'react';
import type { ZestColor, ZestSize } from '../../types';

/**
 * Visual style. `primary` and `danger` are convenience aliases for `solid`
 * with `color="primary"` / `color="error"` (an explicit `color` still wins).
 */
export type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'soft' | 'primary' | 'danger';

export interface ButtonOwnProps {
  /** Visual style. Defaults to `solid`. */
  variant?: ButtonVariant;
  /** Tone. Defaults to `primary` (except the `danger` alias → `error`). */
  color?: ZestColor;
  /** Control size. Defaults to `md`. */
  size?: ZestSize;
  /** Shows a spinner and disables interaction while preserving width. */
  loading?: boolean;
  /** Disables the control. Disabled `href`/`as` buttons render a native `<button disabled>`. */
  disabled?: boolean;
  /** Icon before the label. */
  startIcon?: React.ReactNode;
  /** Icon after the label. */
  endIcon?: React.ReactNode;
  /** Stretches to the container width. */
  fullWidth?: boolean;
  /** Renders an anchor styled as a button. */
  href?: string;
  children?: React.ReactNode;
}

export type ButtonProps<E extends React.ElementType = 'button'> = ButtonOwnProps & {
  /**
   * Element to render instead of button/anchor — accepts that element's props:
   * `<Button as={RouterLink} to="/new">New</Button>`.
   */
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | 'as'> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>;
