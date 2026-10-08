import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import './Typography.css';

/** MUI-style type scale. */
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

/** Text color roles — map to `--zest-color-*` tokens; `inherit` emits no color. */
export type TypographyColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** Semantic element each variant renders when `as` is not given. */
const defaultElement: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
};

export interface TypographyOwnProps {
  /**
   * Type-scale step; also picks the default element (`h1`…`h6`, `p`, `span`).
   * @default 'body1'
   */
  variant?: TypographyVariant;
  /** Text color role. `primary`/`secondary`/`disabled` are text tones; `brand` is the primary accent. */
  color?: TypographyColor;
  /** `text-align`. */
  align?: 'left' | 'center' | 'right';
  /** Truncate to a single line, or clamp to N lines. */
  truncate?: boolean | number;
  /** Adds bottom margin of one line — convenient for document flow. */
  gutterBottom?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type TypographyProps<E extends React.ElementType = 'p'> = PolymorphicProps<
  E,
  TypographyOwnProps
>;

/**
 * Text on the Zest type scale. The variant sets size/weight/line-height and
 * the default semantic element; `as` overrides the element without changing
 * the look.
 *
 * ```tsx
 * <Typography variant="h4">Billing</Typography>
 * <Typography variant="body2" color="secondary" truncate={2}>…</Typography>
 * <Typography variant="overline" as="div">Section</Typography>
 * ```
 */
export const Typography = React.forwardRef(function Typography<E extends React.ElementType = 'p'>(
  props: TypographyProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    variant = 'body1',
    color = 'inherit',
    align,
    truncate,
    gutterBottom,
    className,
    style,
    children,
    ...rest
  } = props as TypographyProps<'p'> & { style?: React.CSSProperties };
  const Component = (as ?? defaultElement[variant]) as React.ElementType;
  const clampLines = typeof truncate === 'number' ? truncate : undefined;
  return (
    <Component
      ref={ref}
      className={cx('zest-typography', className)}
      data-variant={variant}
      data-color={color === 'inherit' ? undefined : color}
      data-truncate={truncate === true ? '' : undefined}
      data-clamp={clampLines !== undefined ? '' : undefined}
      data-gutter={gutterBottom ? '' : undefined}
      data-align={align}
      style={
        clampLines !== undefined
          ? ({ '--zest-clamp-lines': String(clampLines), ...style } as React.CSSProperties)
          : style
      }
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'p'>(
  props: TypographyProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;

/**
 * Alias of {@link Typography} for codebases that prefer the `<Text>` name.
 * Same component, same props.
 */
export const Text = Typography;
