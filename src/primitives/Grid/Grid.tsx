import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import { resolveSpace, type SpaceValue } from '../space';
import './Grid.css';

export interface GridOwnProps {
  /** Number of equal columns, or a full grid-template-columns string. */
  columns?: number | string;
  /** Auto-fit columns with a minimum child width (e.g. "240px"). Overrides `columns`. */
  minChildWidth?: string;
  gap?: SpaceValue;
  rowGap?: SpaceValue;
  columnGap?: SpaceValue;
  /** Cross-axis alignment of items within their tracks (`align-items`). */
  align?: React.CSSProperties['alignItems'];
  /** Main-axis distribution of the column tracks (`justify-content`). */
  justify?: React.CSSProperties['justifyContent'];
  /** Shorthand: center items on both axes. `align`/`justify` still win if set. */
  center?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type GridProps<E extends React.ElementType = 'div'> = PolymorphicProps<E, GridOwnProps>;

export const Grid = React.forwardRef(function Grid<E extends React.ElementType = 'div'>(
  props: GridProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    columns,
    minChildWidth,
    gap = 3,
    rowGap,
    columnGap,
    align,
    justify,
    center,
    className,
    style,
    children,
    ...rest
  } = props as GridProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;

  const template = minChildWidth
    ? `repeat(auto-fit, minmax(min(${minChildWidth}, 100%), 1fr))`
    : typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;

  return (
    <Component
      ref={ref}
      className={cx('zest-grid', className)}
      data-fixed-columns={typeof columns === 'number' && !minChildWidth ? '' : undefined}
      style={{
        ['--zest-grid-columns' as string]: template,
        gap: resolveSpace(gap),
        rowGap: resolveSpace(rowGap),
        columnGap: resolveSpace(columnGap),
        alignItems: align ?? (center ? 'center' : undefined),
        justifyContent: justify ?? (center ? 'center' : undefined),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'div'>(
  props: GridProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
