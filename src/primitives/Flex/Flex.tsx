import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import { resolveSpace, type SpaceValue } from '../space';
import { resolveBoxStyle, type BoxStyleProps } from '../Box/Box';
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

/**
 * Flex also takes every Box style shorthand (`p`/`px`/`m`/…, `flex`, `shrink`,
 * `width`/`minWidth`/`maxWidth`, `height`/…, `overflow`), so
 * `<Flex p={4} minWidth={0} flex={1}>` needs no Box wrapper.
 */
export interface FlexOwnProps extends BoxStyleProps {
  /** Main axis. @default 'row' */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /** Cross-axis alignment (`align-items`). */
  align?: Align;
  /** Main-axis distribution (`justify-content`). */
  justify?: Justify;
  /** Shorthand: center children on both axes. `align`/`justify` still win if set. */
  center?: boolean;
  /** Allow children to wrap onto new lines. */
  wrap?: boolean;
  /** Grow to fill the available space along the parent's main axis (`flex: 1`). An explicit `flex` wins. */
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
  /** `display: inline-flex`. */
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
    ...others
  } = props as FlexProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;
  const { style: boxStyle, rest } = resolveBoxStyle(others);
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
        ...boxStyle,
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
