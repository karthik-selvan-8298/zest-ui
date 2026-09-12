import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import { resolveSpace, type SpaceValue } from '../space';

/** CSS length: numbers are pixels, strings pass through (`'100%'`, `'24rem'`, `'var(--x)'`). */
export type CSSLength = number | string;

/** Token-aware spacing shorthands shared by Box, Flex and Stack. */
export interface BoxSpacingProps {
  /** Padding — Zest space step or CSS length. */
  p?: SpaceValue;
  /** Horizontal padding (`padding-inline`). */
  px?: SpaceValue;
  /** Vertical padding (`padding-block`). */
  py?: SpaceValue;
  /** Padding top. */
  pt?: SpaceValue;
  /** Padding right. */
  pr?: SpaceValue;
  /** Padding bottom. */
  pb?: SpaceValue;
  /** Padding left. */
  pl?: SpaceValue;
  /** Margin — Zest space step or CSS length. */
  m?: SpaceValue;
  /** Horizontal margin (`margin-inline`). */
  mx?: SpaceValue;
  /** Vertical margin (`margin-block`). */
  my?: SpaceValue;
  /** Margin top. */
  mt?: SpaceValue;
  /** Margin right. */
  mr?: SpaceValue;
  /** Margin bottom. */
  mb?: SpaceValue;
  /** Margin left. */
  ml?: SpaceValue;
}

/** Flex-child and sizing shorthands shared by Box, Flex and Stack. */
export interface BoxSizeProps {
  /** `flex` shorthand. `true` → `1 1 0%` (fill, allow shrinking), numbers/strings pass through. */
  flex?: React.CSSProperties['flex'] | boolean;
  /** `flex-grow: 1` (`false` → `0`). */
  grow?: boolean;
  /** `flex-shrink: 1` (`false` → `0`, i.e. never shrink). */
  shrink?: boolean;
  /** `width` — numbers are px. */
  width?: CSSLength;
  /** `height` — numbers are px. */
  height?: CSSLength;
  /** `min-width` — numbers are px. `0` is the usual fix for overflowing flex children. */
  minWidth?: CSSLength;
  /** `min-height` — numbers are px. */
  minHeight?: CSSLength;
  /** `max-width` — numbers are px. */
  maxWidth?: CSSLength;
  /** `max-height` — numbers are px. */
  maxHeight?: CSSLength;
  /** `overflow` (`'auto'`, `'hidden'`, …). */
  overflow?: React.CSSProperties['overflow'];
}

/** Every style shorthand `resolveBoxStyle` understands. */
export interface BoxStyleProps extends BoxSpacingProps, BoxSizeProps {}

export interface BoxOwnProps extends BoxStyleProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type BoxProps<E extends React.ElementType = 'div'> = PolymorphicProps<E, BoxOwnProps>;

function resolveLength(value: CSSLength | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Splits Box's style shorthands (spacing + sizing) out of a props object and
 * turns them into an inline `style`. Layout primitives (Flex, Stack) reuse it
 * so `<Flex p={4} minWidth={0} flex={1}>` works without wrapping in a Box.
 *
 * Returns `style` (`undefined` when no shorthand was set) and `rest` — the
 * remaining props, safe to spread onto the element.
 */
export function resolveBoxStyle<P extends BoxStyleProps>(
  props: P
): { style: React.CSSProperties | undefined; rest: Omit<P, keyof BoxStyleProps> } {
  const {
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    flex,
    grow,
    shrink,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    overflow,
    ...rest
  } = props;
  const style: React.CSSProperties = {};
  let used = false;
  const set = (key: keyof React.CSSProperties, value: string | number | undefined) => {
    if (value !== undefined) {
      (style as Record<string, string | number>)[key as string] = value;
      used = true;
    }
  };
  set('padding', resolveSpace(p));
  set('paddingInline', resolveSpace(px));
  set('paddingBlock', resolveSpace(py));
  set('paddingTop', resolveSpace(pt));
  set('paddingRight', resolveSpace(pr));
  set('paddingBottom', resolveSpace(pb));
  set('paddingLeft', resolveSpace(pl));
  set('margin', resolveSpace(m));
  set('marginInline', resolveSpace(mx));
  set('marginBlock', resolveSpace(my));
  set('marginTop', resolveSpace(mt));
  set('marginRight', resolveSpace(mr));
  set('marginBottom', resolveSpace(mb));
  set('marginLeft', resolveSpace(ml));
  if (flex !== undefined && flex !== false) set('flex', flex === true ? '1 1 0%' : flex);
  if (grow !== undefined) set('flexGrow', grow ? 1 : 0);
  if (shrink !== undefined) set('flexShrink', shrink ? 1 : 0);
  set('width', resolveLength(width));
  set('height', resolveLength(height));
  set('minWidth', resolveLength(minWidth));
  set('minHeight', resolveLength(minHeight));
  set('maxWidth', resolveLength(maxWidth));
  set('maxHeight', resolveLength(maxHeight));
  set('overflow', overflow);
  return { style: used ? style : undefined, rest };
}

/**
 * The lowest-level Zest primitive: a polymorphic element with token-aware
 * spacing and sizing props. Everything else composes on top of it.
 */
export const Box = React.forwardRef(function Box<E extends React.ElementType = 'div'>(
  props: BoxProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const { as, className, style, children, ...others } = props as BoxProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;
  const { style: boxStyle, rest } = resolveBoxStyle(others);
  return (
    <Component
      ref={ref}
      className={cx('zest-box', className)}
      style={boxStyle || style ? { ...boxStyle, ...style } : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'div'>(
  props: BoxProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
