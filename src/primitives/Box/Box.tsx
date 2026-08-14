import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import { resolveSpace, type SpaceValue } from '../space';

export interface BoxOwnProps {
  /** Padding — Zest space step or CSS length. */
  p?: SpaceValue;
  px?: SpaceValue;
  py?: SpaceValue;
  pt?: SpaceValue;
  pr?: SpaceValue;
  pb?: SpaceValue;
  pl?: SpaceValue;
  /** Margin — Zest space step or CSS length. */
  m?: SpaceValue;
  mx?: SpaceValue;
  my?: SpaceValue;
  mt?: SpaceValue;
  mr?: SpaceValue;
  mb?: SpaceValue;
  ml?: SpaceValue;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type BoxProps<E extends React.ElementType = 'div'> = PolymorphicProps<E, BoxOwnProps>;

function buildSpacingStyle(props: BoxOwnProps): React.CSSProperties | undefined {
  const { p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml } = props;
  const style: React.CSSProperties = {};
  let used = false;
  const set = (key: keyof React.CSSProperties, value: SpaceValue | undefined) => {
    const resolved = resolveSpace(value);
    if (resolved !== undefined) {
      (style as Record<string, string>)[key as string] = resolved;
      used = true;
    }
  };
  set('padding', p);
  set('paddingInline', px);
  set('paddingBlock', py);
  set('paddingTop', pt);
  set('paddingRight', pr);
  set('paddingBottom', pb);
  set('paddingLeft', pl);
  set('margin', m);
  set('marginInline', mx);
  set('marginBlock', my);
  set('marginTop', mt);
  set('marginRight', mr);
  set('marginBottom', mb);
  set('marginLeft', ml);
  return used ? style : undefined;
}

/**
 * The lowest-level Zest primitive: a polymorphic element with token-aware
 * spacing props. Everything else composes on top of it.
 */
export const Box = React.forwardRef(function Box<E extends React.ElementType = 'div'>(
  props: BoxProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    className,
    style,
    children,
    p, px, py, pt, pr, pb, pl,
    m, mx, my, mt, mr, mb, ml,
    ...rest
  } = props as BoxProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;
  const spacing = buildSpacingStyle({ p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml });
  return (
    <Component
      ref={ref}
      className={cx('zest-box', className)}
      style={spacing || style ? { ...spacing, ...style } : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'div'>(
  props: BoxProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
