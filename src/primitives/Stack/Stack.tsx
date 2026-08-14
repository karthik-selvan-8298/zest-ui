import * as React from 'react';
import { Flex, type FlexProps } from '../Flex/Flex';

export interface StackOwnProps {
  /** Gap between children. Defaults to space step 2 (8px). */
  spacing?: FlexProps['gap'];
  /** Optional element rendered between each child. */
  divider?: React.ReactElement;
}

export type StackProps<E extends React.ElementType = 'div'> = Omit<FlexProps<E>, 'gap'> &
  StackOwnProps;

/**
 * Vertical (by default) one-dimensional layout with consistent spacing.
 */
export const Stack = React.forwardRef(function Stack<E extends React.ElementType = 'div'>(
  props: StackProps<E>,
  ref: React.ForwardedRef<Element>
) {
  const {
    spacing = 2,
    divider,
    direction = 'column',
    children,
    ...rest
  } = props as StackProps<'div'>;

  let content = children;
  if (divider) {
    const items = React.Children.toArray(children).filter(Boolean);
    content = items.flatMap((child, index) =>
      index === 0 ? [child] : [React.cloneElement(divider, { key: `divider-${index}` }), child]
    );
  }

  return (
    <Flex ref={ref} direction={direction} gap={spacing} {...rest}>
      {content}
    </Flex>
  );
}) as <E extends React.ElementType = 'div'>(
  props: StackProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
