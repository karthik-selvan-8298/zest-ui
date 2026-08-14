import * as React from 'react';
import { Flex, type FlexProps } from '../Flex/Flex';

export type CenterProps<E extends React.ElementType = 'div'> = FlexProps<E>;

/** Centers its children on both axes. */
export const Center = React.forwardRef(function Center<E extends React.ElementType = 'div'>(
  props: CenterProps<E>,
  ref: React.ForwardedRef<Element>
) {
  return <Flex ref={ref} align="center" justify="center" {...(props as CenterProps<'div'>)} />;
}) as <E extends React.ElementType = 'div'>(
  props: CenterProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement;
