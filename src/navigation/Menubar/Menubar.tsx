import * as React from 'react';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { Menu } from '../Menu/Menu';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import '../../base.css';
import '../Menu/Menu.css';
import './Menubar.css';

/*
 * Menubar on Base UI — a desktop-app style row of menu triggers. Base UI's
 * Menubar wraps ordinary Menu roots, so each dropdown is a Menu underneath
 * and reuses the Menu popup/row recipe. Left/Right arrows move between
 * triggers and hovering another trigger while one menu is open switches menus.
 *
 * <Menubar.Root>
 *   <Menubar.Menu>
 *     <Menubar.Trigger>File</Menubar.Trigger>
 *     <Menubar.Content>
 *       <Menubar.Item>New</Menubar.Item>
 *       <Menubar.Separator />
 *       <Menubar.Item destructive>Delete</Menubar.Item>
 *     </Menubar.Content>
 *   </Menubar.Menu>
 *   <Menubar.Menu>…</Menubar.Menu>
 * </Menubar.Root>
 *
 * Nested: <Menubar.SubmenuRoot><Menubar.SubmenuTrigger>Export</Menubar.SubmenuTrigger>
 *   <Menubar.SubmenuContent>…</Menubar.SubmenuContent></Menubar.SubmenuRoot>
 */

export interface MenubarRootProps extends WithClassName<React.ComponentProps<typeof BaseMenubar>> {
  /**
   * `contained` (default) draws the bar as a soft surface pill with a hairline
   * border; `plain` renders the triggers alone with no background or padding.
   */
  variant?: 'contained' | 'plain';
}

const MenubarRoot = React.forwardRef<HTMLDivElement, MenubarRootProps>(function MenubarRoot(
  { variant = 'contained', className, ...props },
  ref
) {
  return (
    <BaseMenubar
      ref={ref}
      className={cx('zest-menubar', className)}
      data-variant={variant}
      {...props}
    />
  );
});

export type MenubarTriggerProps = WithClassName<React.ComponentProps<typeof BaseMenu.Trigger>>;

/** A ghost text button in the bar; highlighted while its menu is open. */
const MenubarTrigger = React.forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  function MenubarTrigger({ className, ...props }, ref) {
    return (
      <BaseMenu.Trigger
        ref={ref}
        className={cx('zest-menubar__trigger', 'zest-focusable', className)}
        {...props}
      />
    );
  }
);

export const Menubar = {
  Root: MenubarRoot,
  /** One dropdown in the bar — a Base UI `Menu.Root`. */
  Menu: BaseMenu.Root,
  Trigger: MenubarTrigger,
  Content: Menu.Content,
  Item: Menu.Item,
  Separator: Menu.Separator,
  Group: Menu.Group,
  GroupLabel: Menu.GroupLabel,
  /* Nested menus and toggles share their implementation with ContextMenu —
     they are the same Base UI Menu parts, valid inside any Menu.Root. */
  SubmenuRoot: ContextMenu.SubmenuRoot,
  SubmenuTrigger: ContextMenu.SubmenuTrigger,
  /** Popup for a `SubmenuRoot` — opens beside its trigger (Base UI's nested default). */
  SubmenuContent: ContextMenu.Content,
  CheckboxItem: ContextMenu.CheckboxItem,
  RadioGroup: ContextMenu.RadioGroup,
  RadioItem: ContextMenu.RadioItem,
};

export type MenubarMenuProps = React.ComponentProps<typeof BaseMenu.Root>;
