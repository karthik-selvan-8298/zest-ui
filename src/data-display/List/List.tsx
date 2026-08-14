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

export const List = {
  Root: ListRoot,
  Item: ListItem,
  ItemIcon: ListItemIcon,
  ItemText: ListItemText,
  ItemAction: ListItemAction,
};
