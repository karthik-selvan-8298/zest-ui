import type * as React from 'react';
import type { ZestColor, ZestSize } from '../../types';

export type ButtonVariant =
  | 'solid'
  | 'outlined'
  | 'ghost'
  | 'soft'
  /** Convenience alias: solid + color="primary". */
  | 'primary'
  /** Convenience alias: solid + color="error". */
  | 'danger';

export interface ButtonOwnProps {
  /** Visual style. Defaults to `solid`. */
  variant?: ButtonVariant;
  /** Tone. Defaults to `primary` (except the `danger` alias → `error`). */
  color?: ZestColor;
  /** Control size. Defaults to `md`. */
  size?: ZestSize;
  /** Shows a spinner and disables interaction while preserving width. */
  loading?: boolean;
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
