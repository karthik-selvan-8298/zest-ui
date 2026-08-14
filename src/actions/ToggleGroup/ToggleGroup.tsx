import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './ToggleGroup.css';

export interface ToggleGroupProps
  extends WithClassName<React.ComponentProps<typeof BaseToggleGroup>> {
  /**
   * Allow several toggles to be pressed at once.
   * Alias for Base UI's `multiple` prop.
   */
  toggleMultiple?: boolean;
}

/**
 * Joined segmented group of Toggles on Base UI ToggleGroup.
 * Single-select by default; pass `toggleMultiple` for multi-select.
 *
 * ```tsx
 * <ToggleGroup defaultValue={['left']}>
 *   <Toggle value="left" aria-label="Align left"><AlignLeftIcon /></Toggle>
 *   <Toggle value="center" aria-label="Align center"><AlignCenterIcon /></Toggle>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup({ toggleMultiple, multiple, className, ...props }, ref) {
    return (
      <BaseToggleGroup
        ref={ref}
        multiple={toggleMultiple ?? multiple}
        className={cx('zest-toggle-group', className)}
        {...props}
      />
    );
  }
);
