import * as React from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../../icons';
import { Tooltip } from '../../overlays/Tooltip/Tooltip';
import { cx, useControllableState } from '../../utils';
import '../../base.css';
import './Sidebar.css';

/** Nesting level of the current item (0 = top level); drives dots and `data-depth`. */
const DepthContext = React.createContext(0);
/** Whether the Root is in mini-rail mode. */
const CollapsedContext = React.createContext(false);
/** True for items rendered inside a mini-rail flyout — labels are visible there. */
const FlyoutContext = React.createContext(false);

/** Tabbable elements the off-canvas focus trap cycles through. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** How long a hover-opened flyout survives the pointer leaving its row (ms). */
const FLYOUT_CLOSE_DELAY = 150;

// ── Hooks ────────────────────────────────────────────────────────────────

/** Writes `node` to a callback or object ref (the two shapes `forwardRef` can hand us). */
function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

/** Returns a stable callback ref that points both a local and a forwarded ref at the node. */
function useMergedRef<T>(localRef: React.Ref<T>, forwardedRef: React.Ref<T>): React.RefCallback<T> {
  return React.useCallback(
    (node: T | null) => {
      assignRef(localRef, node);
      assignRef(forwardedRef, node);
    },
    [localRef, forwardedRef]
  );
}

/**
 * Off-canvas mode is a modal dialog: move focus inside on open, keep Tab
 * cycling within the panel, close on Escape, and hand focus back on close.
 */
function useOffCanvasFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  onClose: (() => void) | undefined
) {
  // Read the latest `onClose` through a ref: callers usually pass an inline
  // arrow, and re-running the trap on every parent render would bounce focus
  // back to the close button.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    (
      container.querySelector<HTMLElement>('.zest-sidebar__mobile-close') ?? focusables()[0]
    )?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, containerRef]);
}

/**
 * Mini-rail flyout state. Opens on hover with a short close grace period (so
 * the pointer can cross the gap into the panel); the trigger toggles it on
 * click, tap and keyboard. Closes on outside pointer-down, on Escape
 * (returning focus to the trigger if it was inside), and when the rail expands.
 */
function useRailFlyout(
  itemRef: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  collapsed: boolean
) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<number | null>(null);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Whether the current open state came from hovering (and hasn't been
  // clicked since). A stale `true` while closed is harmless: the next click
  // opens either way.
  const openedByHover = React.useRef(false);

  // Hover is for mouse/pen only. A touch tap also fires pointerenter/leave
  // right before its click, which would open the flyout and then
  // immediately toggle (or time) it shut again.
  const show = React.useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelClose();
      if (!open) openedByHover.current = true;
      setOpen(true);
    },
    [cancelClose, open]
  );

  const scheduleClose = React.useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelClose();
      closeTimer.current = window.setTimeout(() => setOpen(false), FLYOUT_CLOSE_DELAY);
    },
    [cancelClose]
  );

  // Click / Enter / Space. A click on a row whose flyout hover just opened
  // pins it open rather than closing it under the pointer.
  const toggle = React.useCallback(() => {
    cancelClose();
    const pin = openedByHover.current;
    openedByHover.current = false;
    setOpen((current) => pin || !current);
  }, [cancelClose]);

  // Clear any pending close timer on unmount.
  React.useEffect(() => cancelClose, [cancelClose]);

  // Flyouts only exist in the collapsed rail, so expanding it dismisses any
  // open one. Derived reset during render — no effect round-trip.
  const [wasCollapsed, setWasCollapsed] = React.useState(collapsed);
  if (collapsed !== wasCollapsed) {
    setWasCollapsed(collapsed);
    if (!collapsed) setOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // The panel is about to become `visibility: hidden`; rescue focus from
      // inside it so keyboard users don't drop back to <body>.
      if (itemRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, itemRef, triggerRef]);

  return { open, setOpen, show, scheduleClose, toggle };
}

// ── Root ─────────────────────────────────────────────────────────────────

/** One nav entry in the data-driven API. Nested `items` become expandable children. */
export interface SidebarNavEntry {
  /** React key; falls back to the array index. */
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

/** One labelled group of entries in the data-driven API. */
export interface SidebarNavSection {
  label?: React.ReactNode;
  items: SidebarNavEntry[];
}

export interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Data-driven navigation — sections with (optionally nested) items. */
  nav?: SidebarNavSection[];
  /** Shows the built-in collapse toggle on the sidebar's edge. */
  collapsible?: boolean;
  /** Mini rail mode (controlled). */
  collapsed?: boolean;
  /** Initial mini rail mode for uncontrolled usage. */
  defaultCollapsed?: boolean;
  /** Called when the edge toggle flips the mini rail. */
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

/**
 * The `<aside>` shell: header, scrollable nav, footer, the mini-rail edge
 * toggle and (below 900px) the off-canvas dialog with backdrop.
 */
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

  const asideRef = React.useRef<HTMLElement | null>(null);
  const setAsideRef = useMergedRef(asideRef, ref);
  useOffCanvasFocusTrap(asideRef, mobileOpen, onMobileClose);

  return (
    <CollapsedContext.Provider value={collapsed}>
      {mobileOpen ? (
        <div className="zest-sidebar__backdrop" aria-hidden onClick={onMobileClose} />
      ) : null}
      <aside
        ref={setAsideRef}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label={mobileOpen ? 'Navigation' : undefined}
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
        {onMobileClose ? (
          <button
            type="button"
            aria-label="Close navigation"
            className="zest-sidebar__mobile-close zest-focusable"
            onClick={onMobileClose}
          >
            <CloseIcon size={18} />
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

// ── Section ──────────────────────────────────────────────────────────────

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase section label ("Overview", "Settings"). */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

/** A labelled group of items. In the mini rail the label becomes a short divider. */
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

// ── Item ─────────────────────────────────────────────────────────────────

export interface SidebarItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  label: React.ReactNode;
  /** Leading icon — inherits the accent color when `active`. */
  icon?: React.ReactNode;
  /** Small secondary line under the label. */
  caption?: React.ReactNode;
  /** Trailing badge — a string/number renders as a soft pill; nodes render as-is. */
  badge?: React.ReactNode;
  /** Badge tone when `badge` is a string/number. Defaults to `neutral`. */
  badgeColor?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
  /** Marks the current page (`aria-current="page"` + accent row). */
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

/**
 * A nav row. Renders as a link (`href`), a button, or — with children — an
 * expandable group; in the mini rail a group opens as a hover flyout instead.
 */
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
  const insideFlyout = React.useContext(FlyoutContext);
  // `toArray` drops null/false, so `{cond && <Sidebar.Item/>}` alone doesn't
  // turn a leaf into an empty expandable group.
  const hasChildren = React.Children.toArray(children).length > 0;

  const itemRef = React.useRef<HTMLLIElement | null>(null);
  const setItemRef = useMergedRef(itemRef, ref);
  const flyoutTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const flyoutId = React.useId();
  const flyout = useRailFlyout(itemRef, flyoutTriggerRef, collapsed);

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

  // Icon-only rail leaves surface their hidden label as a tooltip. Items
  // inside a flyout show their label, and submenu triggers show it in the
  // flyout header — no tooltip for either.
  const withTooltip = (trigger: React.ReactElement) =>
    collapsed && !insideFlyout ? (
      <Tooltip title={label} side="right">
        {trigger}
      </Tooltip>
    ) : (
      trigger
    );

  let row: React.ReactNode;
  if (hasChildren && collapsed) {
    // Mini rail: a disclosure button + absolutely positioned flyout panel.
    row = (
      <div
        className="zest-sidebar__flyout-anchor"
        onPointerEnter={disabled ? undefined : flyout.show}
        onPointerLeave={disabled ? undefined : flyout.scheduleClose}
      >
        <button
          ref={flyoutTriggerRef}
          type="button"
          aria-expanded={flyout.open}
          aria-controls={flyoutId}
          disabled={disabled}
          {...rowProps}
          onClick={(event) => {
            onClick?.(event);
            flyout.toggle();
          }}
        >
          {rowContent}
        </button>
        <div
          id={flyoutId}
          className="zest-sidebar__flyout"
          data-open={flyout.open ? '' : undefined}
          onClick={() => flyout.setOpen(false)}
        >
          <div className="zest-sidebar__flyout-header">
            {icon ? (
              <span className="zest-sidebar__icon" aria-hidden>
                {icon}
              </span>
            ) : null}
            <span className="zest-sidebar__flyout-title">{label}</span>
          </div>
          <FlyoutContext.Provider value={true}>{nested}</FlyoutContext.Provider>
        </div>
      </div>
    );
  } else if (hasChildren) {
    // Expanded sidebar: inline collapsible group.
    row = (
      <Collapsible.Root defaultOpen={defaultExpanded} disabled={disabled}>
        <Collapsible.Trigger render={<button type="button" {...rowProps} disabled={disabled} />}>
          {rowContent}
        </Collapsible.Trigger>
        <Collapsible.Panel className="zest-sidebar__panel">{nested}</Collapsible.Panel>
      </Collapsible.Root>
    );
  } else if (href && !disabled) {
    row = withTooltip(
      <a href={href} {...rowProps}>
        {rowContent}
      </a>
    );
  } else {
    row = withTooltip(
      <button type="button" disabled={disabled} {...rowProps}>
        {rowContent}
      </button>
    );
  }

  return (
    <li
      ref={setItemRef}
      className={cx('zest-sidebar__item', className)}
      data-depth={depth}
      {...props}
    >
      {row}
    </li>
  );
});

/**
 * App sidebar navigation: sections of (optionally nested) items, a
 * collapsible mini rail with hover flyouts, and an off-canvas mobile mode.
 *
 * ```tsx
 * <Sidebar.Root header={<Logo />} collapsible>
 *   <Sidebar.Section label="Overview">
 *     <Sidebar.Item icon={<BotIcon />} label="MCP" defaultExpanded>
 *       <Sidebar.Item label="Tools" href="/mcp/tools" active />
 *     </Sidebar.Item>
 *   </Sidebar.Section>
 * </Sidebar.Root>
 *
 * // Data-driven (e.g. straight from an API):
 * <Sidebar.Root nav={[{ label: 'Overview', items: [{ key: 'mcp', label: 'MCP' }] }]} />
 * ```
 */
export const Sidebar = {
  Root: SidebarRoot,
  Section: SidebarSection,
  Item: SidebarItem,
};
