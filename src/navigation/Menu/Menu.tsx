import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './Menu.css';

/*
 * Menu on Base UI — keyboard navigation, typeahead, and aria wiring come
 * from the primitive.
 *
 * <Menu.Root>
 *   <Menu.Trigger render={<Button variant="outlined">Actions</Button>} />
 *   <Menu.Content>
 *     <Menu.Item onClick={…}><EditIcon /> Rename</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item destructive><TrashIcon /> Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 */

export interface MenuContentProps
  extends WithClassName<React.ComponentProps<typeof BaseMenu.Popup>> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
}

const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(
  { side = 'bottom', align = 'start', sideOffset = 4, className, children, ...props },
  ref
) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="zest-menu__positioner"
      >
        <BaseMenu.Popup ref={ref} className={cx('zest-menu__popup', className)} {...props}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

export interface MenuItemProps extends WithClassName<React.ComponentProps<typeof BaseMenu.Item>> {
  /** Styles the item with the error tone for irreversible actions. */
  destructive?: boolean;
}

const MenuItem = React.forwardRef<HTMLElement, MenuItemProps>(function MenuItem(
  { destructive = false, className, ...props },
  ref
) {
  return (
    <BaseMenu.Item
      ref={ref}
      className={cx('zest-menu__item', className)}
      data-destructive={destructive ? '' : undefined}
      {...props}
    />
  );
});

export type MenuSeparatorProps = WithClassName<React.ComponentProps<typeof BaseMenu.Separator>>;

const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  function MenuSeparator({ className, ...props }, ref) {
    return (
      <BaseMenu.Separator ref={ref} className={cx('zest-menu__separator', className)} {...props} />
    );
  }
);

export type MenuGroupProps = WithClassName<React.ComponentProps<typeof BaseMenu.Group>>;

const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(function MenuGroup(
  { className, ...props },
  ref
) {
  return <BaseMenu.Group ref={ref} className={cx('zest-menu__group', className)} {...props} />;
});

export type MenuGroupLabelProps = WithClassName<React.ComponentProps<typeof BaseMenu.GroupLabel>>;

const MenuGroupLabel = React.forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  function MenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        className={cx('zest-menu__group-label', className)}
        {...props}
      />
    );
  }
);

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
};

export type MenuRootProps = React.ComponentProps<typeof BaseMenu.Root>;
