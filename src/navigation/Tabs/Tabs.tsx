import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './Tabs.css';

/*
 * Tabs on Base UI — roving focus, keyboard activation, aria wiring.
 *
 * <Tabs.Root defaultValue="general">
 *   <Tabs.List>
 *     <Tabs.Tab value="general">General</Tabs.Tab>
 *     <Tabs.Tab value="security">Security</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="general">…</Tabs.Panel>
 *   <Tabs.Panel value="security">…</Tabs.Panel>
 * </Tabs.Root>
 */

export type TabsRootProps = WithClassName<React.ComponentProps<typeof BaseTabs.Root>>;

const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { className, ...props },
  ref
) {
  return <BaseTabs.Root ref={ref} className={cx('zest-tabs', className)} {...props} />;
});

export interface TabsListProps extends WithClassName<React.ComponentProps<typeof BaseTabs.List>> {
  /** Stretch tabs to share the full width equally. */
  fullWidth?: boolean;
  /**
   * Visual style:
   * - 'underline' (default): sliding indicator under the active tab
   * - 'segmented': pill control, active tab = solid accent pill
   * - 'soft': muted track, active tab = raised light chip
   */
  variant?: 'underline' | 'segmented' | 'soft';
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, fullWidth, variant = 'underline', children, ...props },
  ref
) {
  return (
    <BaseTabs.List
      ref={ref}
      className={cx('zest-tabs__list', className)}
      data-full-width={fullWidth ? '' : undefined}
      data-variant={variant}
      {...props}
    >
      {children}
      {variant === 'underline' ? <BaseTabs.Indicator className="zest-tabs__indicator" /> : null}
    </BaseTabs.List>
  );
});

export type TabProps = WithClassName<React.ComponentProps<typeof BaseTabs.Tab>>;

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { className, ...props },
  ref
) {
  return (
    <BaseTabs.Tab ref={ref} className={cx('zest-tabs__tab', 'zest-focusable', className)} {...props} />
  );
});

export type TabPanelProps = WithClassName<React.ComponentProps<typeof BaseTabs.Panel>>;

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { className, ...props },
  ref
) {
  return <BaseTabs.Panel ref={ref} className={cx('zest-tabs__panel', className)} {...props} />;
});

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab,
  Panel: TabPanel,
};
