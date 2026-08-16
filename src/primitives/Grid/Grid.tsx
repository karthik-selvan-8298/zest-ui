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
  /**
   * Gutter between cells, applied on BOTH axes (like MUI's `spacing`).
   * @default 4 (16px — MUI `spacing={2}`)
   */
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
    gap = 4,
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
      /* All dynamic styling flows through custom properties consumed by
         Grid.css — mixing them with regular props in one inline style object
         proved unreliable (regular props were dropped at commit time). */
      style={{
        ['--zest-grid-columns' as string]: template,
        ['--zest-grid-fixed-count' as string]:
          typeof columns === 'number' && !minChildWidth ? String(columns) : undefined,
        ['--zest-grid-gap' as string]: resolveSpace(gap),
        ['--zest-grid-row-gap' as string]: resolveSpace(rowGap),
        ['--zest-grid-column-gap' as string]: resolveSpace(columnGap),
        ['--zest-grid-align' as string]: align ?? (center ? 'center' : undefined),
        ['--zest-grid-justify' as string]: justify ?? (center ? 'center' : undefined),
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
