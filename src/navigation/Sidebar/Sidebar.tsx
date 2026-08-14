import * as React from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import '../../base.css';
import './Sidebar.css';

/*
 * App sidebar navigation (the QA dashboard nav language).
 *
 * Composition:
 *   <Sidebar.Root header={<Logo/>} collapsible>
 *     <Sidebar.Section label="Overview">
 *       <Sidebar.Item icon={<BotIcon/>} label="MCP" defaultExpanded>
 *         <Sidebar.Item label="Tools" active />
 *       </Sidebar.Item>
 *     </Sidebar.Section>
 *   </Sidebar.Root>
 *
 * Data-driven (e.g. straight from an API):
 *   <Sidebar.Root nav={[{ label: 'Overview', items: [{ key: 'mcp', label: 'MCP', … }] }]} />
 */

const DepthContext = React.createContext(0);
const CollapsedContext = React.createContext(false);

/** One nav entry in the data-driven API. Nested `items` become expandable children. */
export interface SidebarNavEntry {
  key?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  caption?: React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: SidebarItemProps['badgeColor'];
  active?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  defaultExpanded?: boolean;
  items?: SidebarNavEntry[];
}

export interface SidebarNavSection {
  label?: React.ReactNode;
  items: SidebarNavEntry[];
}

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Data-driven navigation — sections with (optionally nested) items. */
  nav?: SidebarNavSection[];
  /** Shows the built-in collapse toggle in the header (ChatGPT style). */
  collapsible?: boolean;
  /** Mini rail mode (controlled). */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Top slot (logo / product name), shown when expanded. */
  header?: React.ReactNode;
  /** Compact logo shown in the mini rail header when collapsed. */
  logo?: React.ReactNode;
  /** Bottom slot (version, user). */
  footer?: React.ReactNode;
  /** Mobile (<900px): whether the off-canvas sidebar is open. */
  mobileOpen?: boolean;
  /** Called when the mobile backdrop is clicked or Escape is pressed. */
  onMobileClose?: () => void;
  children?: React.ReactNode;
}

function renderEntries(entries: SidebarNavEntry[]): React.ReactNode {
  return entries.map((entry, index) => {
    const { items, key, ...itemProps } = entry;
    return (
      <SidebarItem key={key ?? index} {...itemProps}>
        {items && items.length > 0 ? renderEntries(items) : undefined}
      </SidebarItem>
    );
  });
}

const SidebarRoot = React.forwardRef<HTMLElement, SidebarRootProps>(function SidebarRoot(
  {
    nav,
    collapsible = false,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    header,
    logo,
    footer,
    mobileOpen = false,
    onMobileClose,
    className,
    children,
    ...props
  },
  ref
) {
  const [collapsed, setCollapsed] = useControllableState<boolean>({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });

  React.useEffect(() => {
    if (!mobileOpen || !onMobileClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onMobileClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onMobileClose]);

  return (
    <CollapsedContext.Provider value={collapsed}>
      {mobileOpen ? (
        <div className="zest-sidebar__backdrop" aria-hidden onClick={onMobileClose} />
      ) : null}
      <aside
        ref={ref}
        className={cx('zest-sidebar', className)}
        data-collapsed={collapsed ? '' : undefined}
        data-mobile-open={mobileOpen ? '' : undefined}
        {...props}
      >
        {collapsible ? (
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="zest-sidebar__edge-toggle zest-focusable"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
          </button>
        ) : null}
        {header && !collapsed ? <div className="zest-sidebar__header">{header}</div> : null}
        {logo && collapsed ? (
          <div className="zest-sidebar__header" data-mini="">
            {logo}
          </div>
        ) : null}
        <nav className="zest-sidebar__nav">
          {nav
            ? nav.map((section, index) => (
                <SidebarSection key={index} label={section.label}>
                  {renderEntries(section.items)}
                </SidebarSection>
              ))
            : null}
          {children}
        </nav>
        {footer ? <div className="zest-sidebar__footer">{footer}</div> : null}
      </aside>
    </CollapsedContext.Provider>
  );
});

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase section label ("Overview", "Settings"). */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  function SidebarSection({ label, className, children, ...props }, ref) {
    const collapsed = React.useContext(CollapsedContext);
    return (
      <div ref={ref} className={cx('zest-sidebar__section', className)} {...props}>
        {label && !collapsed ? <div className="zest-sidebar__section-label">{label}</div> : null}
        {label && collapsed ? <div className="zest-sidebar__section-divider" /> : null}
        <ul className="zest-sidebar__list">{children}</ul>
      </div>
    );
  }
);

export interface SidebarItemProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  label: React.ReactNode;
  /** Leading icon — plain by default; gets a tinted tile when `active`. */
  icon?: React.ReactNode;
  /** Small secondary line under the label. */
  caption?: React.ReactNode;
  /** Trailing badge — a string/number renders as a soft pill; nodes render as-is. */
  badge?: React.ReactNode;
  /** Badge tone when `badge` is a string/number. */
  badgeColor?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
  active?: boolean;
  disabled?: boolean;
  /** Renders the row as a link. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Nested items — the row becomes expandable. */
  children?: React.ReactNode;
  /** Initial expanded state when the item has children. */
  defaultExpanded?: boolean;
}

const SidebarItem = React.forwardRef<HTMLLIElement, SidebarItemProps>(function SidebarItem(
  {
    label,
    icon,
    caption,
    badge,
    badgeColor = 'neutral',
    active = false,
    disabled = false,
    href,
    onClick,
    children,
    defaultExpanded = false,
    className,
    ...props
  },
  ref
) {
  const depth = React.useContext(DepthContext);
  const collapsed = React.useContext(CollapsedContext);
  const hasChildren = React.Children.count(children) > 0;

  const badgeNode =
    badge === undefined ? null : typeof badge === 'string' || typeof badge === 'number' ? (
      <span className="zest-sidebar__badge" data-accent={badgeColor}>
        {badge}
      </span>
    ) : (
      badge
    );

  const rowContent = (
    <>
      {depth > 0 && !icon ? <span className="zest-sidebar__dot" aria-hidden /> : null}
      {icon ? (
        <span className="zest-sidebar__icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="zest-sidebar__texts">
        <span className="zest-sidebar__label">{label}</span>
        {caption ? <span className="zest-sidebar__caption">{caption}</span> : null}
      </span>
      {badgeNode}
      {hasChildren ? (
        <span className="zest-sidebar__chevron" aria-hidden>
          {collapsed ? <ChevronRightIcon size={14} /> : <ChevronDownIcon size={16} />}
        </span>
      ) : null}
    </>
  );

  const rowProps = {
    className: cx('zest-sidebar__row', 'zest-focusable'),
    'data-active': active ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'aria-current': active ? ('page' as const) : undefined,
    onClick: disabled ? undefined : onClick,
  };

  const nested = hasChildren ? (
    <DepthContext.Provider value={depth + 1}>
      <ul className="zest-sidebar__sublist">{children}</ul>
    </DepthContext.Provider>
  ) : null;

  return (
    <li
      ref={ref}
      className={cx('zest-sidebar__item', className)}
      data-depth={depth}
      {...props}
    >
      {hasChildren && collapsed ? (
        <>
          <button
            type="button"
            aria-haspopup="true"
            disabled={disabled}
            {...rowProps}
          >
            {rowContent}
          </button>
          <div className="zest-sidebar__flyout">
            <div className="zest-sidebar__flyout-header">
              {icon ? (
                <span className="zest-sidebar__icon" aria-hidden>
                  {icon}
                </span>
              ) : null}
              <span className="zest-sidebar__flyout-title">{label}</span>
            </div>
            {nested}
          </div>
        </>
      ) : hasChildren ? (
        <Collapsible.Root defaultOpen={defaultExpanded} disabled={disabled}>
          <Collapsible.Trigger
            render={<button type="button" {...rowProps} disabled={disabled} />}
          >
            {rowContent}
          </Collapsible.Trigger>
          <Collapsible.Panel className="zest-sidebar__panel">{nested}</Collapsible.Panel>
        </Collapsible.Root>
      ) : href && !disabled ? (
        <a href={href} {...rowProps}>
          {rowContent}
        </a>
      ) : (
        <button type="button" disabled={disabled} {...rowProps}>
          {rowContent}
        </button>
      )}
    </li>
  );
});

export const Sidebar = {
  Root: SidebarRoot,
  Section: SidebarSection,
  Item: SidebarItem,
};
