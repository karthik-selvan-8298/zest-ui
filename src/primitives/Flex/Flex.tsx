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
  wrap?: boolean;
  /** Gap between children — Zest space step or CSS length. */
  gap?: SpaceValue;
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
    wrap,
    gap,
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
      style={{
        display: inline ? 'inline-flex' : undefined,
        flexDirection: direction === 'row' ? undefined : direction,
        alignItems: align ? alignMap[align] : undefined,
        justifyContent: justify ? justifyMap[justify] : undefined,
        flexWrap: wrap ? 'wrap' : undefined,
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
