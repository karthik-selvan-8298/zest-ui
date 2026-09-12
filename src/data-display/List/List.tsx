import * as React from 'react';
import { cx } from '../../utils';
import '../../base.css';
import './List.css';

/*
 * List — composable rows with icon / two-line text / trailing action slots.
 *
 * <List.Root bordered>
 *   <List.Item onClick={open}>
 *     <List.ItemIcon><UserIcon /></List.ItemIcon>
 *     <List.ItemText primary="Ada Lovelace" secondary="Engineering" />
 *     <List.ItemAction><IconButton …/></List.ItemAction>
 *   </List.Item>
 *   <List.Row leading={<Avatar …/>} title="Grace Hopper" subtitle="Compilers"
 *     trailing={<IconButton …/>} onClick={open} divider />
 * </List.Root>
 */

export interface ListRootProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Wrap the list in a subtle border with row dividers. */
  bordered?: boolean;
  /** Inset padding so hover backgrounds float inside the container. */
  inset?: boolean;
  children?: React.ReactNode;
}

const ListRoot = React.forwardRef<HTMLUListElement, ListRootProps>(function ListRoot(
  { bordered = false, inset = false, className, ...props },
  ref
) {
  return (
    <ul
      ref={ref}
      className={cx('zest-list', className)}
      data-bordered={bordered ? '' : undefined}
      data-inset={inset ? '' : undefined}
      {...props}
    />
  );
});

export interface ListItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** Makes the row a button with hover/press affordances. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { onClick, className, children, ...props },
  ref
) {
  return (
    <li
      ref={ref}
      className={cx('zest-list__item', className)}
      data-clickable={onClick ? '' : undefined}
      {...props}
    >
      {onClick ? (
        <button type="button" className="zest-list__item-button zest-focusable" onClick={onClick}>
          {children}
        </button>
      ) : (
        children
      )}
    </li>
  );
});

const ListItemIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function ListItemIcon({ className, ...props }, ref) {
    return <span ref={ref} className={cx('zest-list__item-icon', className)} {...props} />;
  }
);

export interface ListItemTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** First line. */
  primary?: React.ReactNode;
  /** Second, subdued line. */
  secondary?: React.ReactNode;
  children?: React.ReactNode;
}

const ListItemText = React.forwardRef<HTMLSpanElement, ListItemTextProps>(function ListItemText(
  { primary, secondary, className, children, ...props },
  ref
) {
  return (
    <span ref={ref} className={cx('zest-list__item-text', className)} {...props}>
      {primary !== undefined ? <span className="zest-list__item-primary">{primary}</span> : null}
      {secondary !== undefined ? (
        <span className="zest-list__item-secondary">{secondary}</span>
      ) : null}
      {children}
    </span>
  );
});

const ListItemAction = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function ListItemAction({ className, ...props }, ref) {
    return <span ref={ref} className={cx('zest-list__item-action', className)} {...props} />;
  }
);

export interface ListRowProps extends Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  'onClick' | 'title'
> {
  /** Leading visual — icon or Avatar, rendered in `List.ItemIcon`. */
  leading?: React.ReactNode;
  /** First line (`List.ItemText primary`). */
  title: React.ReactNode;
  /** Second, subdued line (`List.ItemText secondary`). */
  subtitle?: React.ReactNode;
  /**
   * Trailing content in `List.ItemAction`. When the row is clickable the
   * trailing slot stays a sibling of the row button so interactive controls
   * (an IconButton menu) never nest inside a `<button>`.
   */
  trailing?: React.ReactNode;
  /** Bottom hairline; skipped on the last row and inside bordered lists (which divide already). */
  divider?: boolean;
  /** Makes the title area a button. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Makes the title area a link instead of a button. */
  href?: string;
  /** Disables the row button/link and dims the row. */
  disabled?: boolean;
  /** Highlights the row and marks the control `aria-current`. */
  selected?: boolean;
}

/**
 * One-line row recipe on top of the List parts: leading + two-line text +
 * trailing. Clickable rows keep the title area as the control and the
 * trailing slot as a sibling, so a trailing menu button is never nested
 * inside another button.
 */
const ListRow = React.forwardRef<HTMLLIElement, ListRowProps>(function ListRow(
  {
    leading,
    title,
    subtitle,
    trailing,
    divider = false,
    onClick,
    href,
    disabled = false,
    selected = false,
    className,
    ...props
  },
  ref
) {
  const interactive = Boolean(onClick || href);
  const content = (
    <>
      {leading !== undefined && leading !== null ? <ListItemIcon>{leading}</ListItemIcon> : null}
      <ListItemText primary={title} secondary={subtitle} />
    </>
  );

  let main: React.ReactNode = content;
  if (interactive) {
    const mainClassName = 'zest-list__item-button zest-list__row-main zest-focusable';
    main = href ? (
      <a
        className={mainClassName}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        aria-current={selected ? 'true' : undefined}
        onClick={disabled ? undefined : onClick}
      >
        {content}
      </a>
    ) : (
      <button
        type="button"
        className={mainClassName}
        disabled={disabled}
        aria-current={selected ? 'true' : undefined}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <ListItem
      ref={ref}
      className={cx('zest-list__row', className)}
      data-clickable={interactive ? '' : undefined}
      data-divider={divider ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-selected={selected ? '' : undefined}
      {...props}
    >
      {main}
      {trailing !== undefined && trailing !== null ? (
        <ListItemAction>{trailing}</ListItemAction>
      ) : null}
    </ListItem>
  );
});

export const List = {
  Root: ListRoot,
  Item: ListItem,
  ItemIcon: ListItemIcon,
  ItemText: ListItemText,
  ItemAction: ListItemAction,
  Row: ListRow,
};
