import type * as React from 'react';

/**
 * Pragmatic polymorphic typing: `as` switches the rendered element and its
 * native props while `OwnProps` always win on conflict.
 */
export type PolymorphicProps<E extends React.ElementType, OwnProps> = OwnProps &
  Omit<React.ComponentPropsWithoutRef<E>, keyof OwnProps | 'as'> & {
    as?: E;
  };
