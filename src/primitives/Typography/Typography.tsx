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
  variant?: TypographyVariant;
  /** Text color role. `primary`/`secondary`/`disabled` are text tones; `brand` is the primary accent. */
  color?: TypographyColor;
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

export const Typography = React.forwardRef(function Typography<
  E extends React.ElementType = 'p',
>(props: TypographyProps<E>, ref: React.ForwardedRef<Element>) {
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
      style={
        align || clampLines !== undefined
          ? ({ textAlign: align, '--zest-clamp-lines': clampLines, ...style } as React.CSSProperties)
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

/** Convenience aliases */
export const Text = Typography;
