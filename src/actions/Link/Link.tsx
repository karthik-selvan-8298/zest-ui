import * as React from 'react';
import { cx } from '../../utils';
import '../../base.css';
import './Link.css';

export interface LinkOwnProps {
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean;
  /** Underline behavior. Defaults to `hover`. */
  underline?: 'always' | 'hover' | 'none';
  color?: 'primary' | 'inherit';
  className?: string;
  children?: React.ReactNode;
}

/**
 * `as` switches the rendered element and its accepted props — pass a router
 * link for internal navigation: `<Link as={RouterLink} to="/settings">`.
 */
export type LinkProps<E extends React.ElementType = 'a'> = LinkOwnProps & {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof LinkOwnProps | 'as'>;

/**
 * Styled link for both worlds:
 *
 * ```tsx
 * <Link href="https://docs.example.com" external>Docs</Link>   // external
 * <Link as={RouterLink} to="/settings">Settings</Link>          // SPA routing
 * ```
 */
export const Link = React.forwardRef(function Link<E extends React.ElementType = 'a'>(
  props: LinkProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    external = false,
    underline = 'hover',
    color = 'primary',
    className,
    children,
    ...rest
  } = props as LinkProps<'a'>;
  const Component = (as ?? 'a') as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cx('zest-link', 'zest-focusable', className)}
      data-underline={underline}
      data-color={color}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'a'>(
  props: LinkProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
