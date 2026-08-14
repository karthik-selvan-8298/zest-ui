import * as React from 'react';

export interface UseControllableStateOptions<T> {
  /** Controlled value. When defined, the hook mirrors it. */
  value?: T;
  /** Initial value for uncontrolled usage. */
  defaultValue: T;
  /** Called on every change in both modes. */
  onChange?: (value: T) => void;
}

/**
 * Standard controlled/uncontrolled state helper.
 * Used by Zest components that don't delegate state to Base UI.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const onChangeRef = React.useRef(onChange);
  React.useInsertionEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  return [current, setValue];
}
