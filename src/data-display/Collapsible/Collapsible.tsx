import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { ChevronDownIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './Collapsible.css';

/*
 * Standalone disclosure — the themed replacement for <details>/<summary>.
 *
 * <Collapsible.Root defaultOpen>
 *   <Collapsible.Trigger>Advanced options</Collapsible.Trigger>
 *   <Collapsible.Panel>…</Collapsible.Panel>
 * </Collapsible.Root>
 */

export type CollapsibleRootProps = WithClassName<
  React.ComponentProps<typeof BaseCollapsible.Root>
>;

const CollapsibleRoot = React.forwardRef<HTMLDivElement, CollapsibleRootProps>(
  function CollapsibleRoot({ className, ...props }, ref) {
    return (
      <BaseCollapsible.Root ref={ref} className={cx('zest-collapsible', className)} {...props} />
    );
  }
);

export type CollapsibleTriggerProps = WithClassName<
  React.ComponentProps<typeof BaseCollapsible.Trigger>
>;

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, children, ...props }, ref) {
    return (
      <BaseCollapsible.Trigger
        ref={ref}
        className={cx('zest-collapsible__trigger', 'zest-focusable', className)}
        {...props}
      >
        <span className="zest-collapsible__label">{children}</span>
        <ChevronDownIcon size={16} className="zest-collapsible__chevron" />
      </BaseCollapsible.Trigger>
    );
  }
);

export type CollapsiblePanelProps = WithClassName<
  React.ComponentProps<typeof BaseCollapsible.Panel>
>;

const CollapsiblePanel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  function CollapsiblePanel({ className, children, ...props }, ref) {
    return (
      <BaseCollapsible.Panel
        ref={ref}
        className={cx('zest-collapsible__panel', className)}
        {...props}
      >
        <div className="zest-collapsible__content">{children}</div>
      </BaseCollapsible.Panel>
    );
  }
);

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
