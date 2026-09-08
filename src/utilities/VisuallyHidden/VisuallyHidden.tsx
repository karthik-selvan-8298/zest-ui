import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../../primitives/polymorphic';
import '../../base.css';
import './VisuallyHidden.css';

export interface VisuallyHiddenOwnProps {
  /**
   * Reveal the element while it has keyboard focus (skip-link pattern).
   * Only meaningful on focusable elements — `as="a"` with `href`, or a button.
   */
  focusable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type VisuallyHiddenProps<E extends React.ElementType = 'span'> = PolymorphicProps<
  E,
  VisuallyHiddenOwnProps
>;

/**
 * Screen-reader-only content. Renders a `<span>` by default (`as` switches the
 * element) with the shared `zest-visually-hidden` clipping applied, so the text
 * is announced by assistive technology but takes no visual space.
 *
 * ```tsx
 * <IconButton aria-label="Close" />            // prefer aria-label for icon buttons
 * <Button><TrashIcon /><VisuallyHidden>Delete draft</VisuallyHidden></Button>
 * <VisuallyHidden as="a" href="#main" focusable>Skip to content</VisuallyHidden>
 * ```
 */
export const VisuallyHidden = React.forwardRef(function VisuallyHidden<
  E extends React.ElementType = 'span',
>(props: VisuallyHiddenProps<E>, ref: React.ForwardedRef<Element>) {
  const {
    as,
    focusable = false,
    className,
    children,
    ...rest
  } = props as VisuallyHiddenProps<'span'>;
  const Component = (as ?? 'span') as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cx(
        'zest-visually-hidden',
        focusable && 'zest-visually-hidden--focusable zest-focusable',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'span'>(
  props: VisuallyHiddenProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
