import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import './Paper.css';

export interface PaperOwnProps {
  /** Elevation shadow token. @default 'none' */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'card';
  /** Outlined surface instead of (or with) elevation. */
  bordered?: boolean;
  /** Corner radius token. @default 'lg' */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

export type PaperProps<E extends React.ElementType = 'div'> = PolymorphicProps<E, PaperOwnProps>;

/**
 * A themed surface — the base of cards, menus, and dialogs.
 *
 * ```tsx
 * <Paper shadow="card" radius="xl">…</Paper>
 * <Paper as="section" bordered>…</Paper>
 * ```
 */
export const Paper = React.forwardRef(function Paper<E extends React.ElementType = 'div'>(
  props: PaperProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    as,
    shadow = 'none',
    bordered = false,
    radius = 'lg',
    className,
    children,
    ...rest
  } = props as PaperProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cx('zest-paper', className)}
      data-shadow={shadow}
      data-bordered={bordered ? '' : undefined}
      data-radius={radius}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'div'>(
  props: PaperProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
