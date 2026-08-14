import * as React from 'react';
import { cx } from '../../utils';
import type { PolymorphicProps } from '../polymorphic';
import './Container.css';

export interface ContainerOwnProps {
  /** Max content width, keyed to theme breakpoints. `false` = fluid. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
  /** Remove the responsive horizontal padding. */
  disableGutters?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type ContainerProps<E extends React.ElementType = 'div'> = PolymorphicProps<
  E,
  ContainerOwnProps
>;

export const Container = React.forwardRef(function Container<
  E extends React.ElementType = 'div',
>(props: ContainerProps<E>, ref: React.ForwardedRef<Element>) {
  const {
    as,
    maxWidth = 'lg',
    disableGutters = false,
    className,
    children,
    ...rest
  } = props as ContainerProps<'div'>;
  const Component = (as ?? 'div') as React.ElementType;
  return (
    <Component
      ref={ref}
      className={cx('zest-container', className)}
      data-max-width={maxWidth === false ? 'none' : maxWidth}
      data-gutters={disableGutters ? undefined : ''}
      {...rest}
    >
      {children}
    </Component>
  );
}) as <E extends React.ElementType = 'div'>(
  props: ContainerProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
