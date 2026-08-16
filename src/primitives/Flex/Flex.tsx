import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import { resolveSpace, type SpaceValue } from '../space';
import './Flex.css';

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const alignMap: Record<Align, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};
const justifyMap: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export interface FlexOwnProps {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  align?: Align;
  justify?: Justify;
  /** Shorthand: center children on both axes. `align`/`justify` still win if set. */
  center?: boolean;
  wrap?: boolean;
  /** Grow to fill the available space along the parent's main axis (`flex: 1`). */
  grow?: boolean;
  /** Fill the cross axis (`width`/`height: 100%` depending on parent direction). */
  fullWidth?: boolean;
  /** Gap between children — Zest space step or CSS length. */
  gap?: SpaceValue;
  /**
   * Row layouts switch to a column on phones (<600px). Only meaningful with
   * the default `direction="row"` — explicit column directions already stack.
   */
  stackOnMobile?: boolean;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type FlexProps<E extends React.ElementType = 'div'> = PolymorphicProps<E, FlexOwnProps>;

export const Flex = React.forwardRef(function Flex<E extends React.ElementType = 'div'>(
  props: FlexProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    direction = 'row',
    align,
    justify,
    center,
    wrap,
    grow,
    fullWidth,
    gap,
    stackOnMobile,
    inline,
    className,
    style,
    children,
    ...rest
  } = props as FlexProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cx('zest-flex', className)}
      data-stack-mobile={stackOnMobile ? '' : undefined}
      style={{
        display: inline ? 'inline-flex' : undefined,
        flexDirection: direction === 'row' ? undefined : direction,
        alignItems: align ? alignMap[align] : center ? 'center' : undefined,
        justifyContent: justify ? justifyMap[justify] : center ? 'center' : undefined,
        flexWrap: wrap ? 'wrap' : undefined,
        flex: grow ? 1 : undefined,
        width: fullWidth ? '100%' : undefined,
        gap: resolveSpace(gap),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'div'>(
  props: FlexProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
