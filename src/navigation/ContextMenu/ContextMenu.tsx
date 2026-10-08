import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import {
  Menu,
  type MenuCheckboxItemProps,
  type MenuGroupLabelProps,
  type MenuGroupProps,
  type MenuItemProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuSeparatorProps,
  type MenuSubmenuRootProps,
  type MenuSubmenuTriggerProps,
} from '../Menu/Menu';
import '../../base.css';
import '../Menu/Menu.css';
import './ContextMenu.css';

/*
 * Base UI's ContextMenu re-exports the Menu parts (Item, Group, Separator,
 * SubmenuRoot, CheckboxItem, …) — they are the very same components. So only
 * the Trigger and Content differ here; every row part is Zest's Menu part,
 * which keeps one implementation of the row recipe.
 */

export type ContextMenuRootProps = React.ComponentProps<typeof BaseContextMenu.Root>;

export type ContextMenuTriggerProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.Trigger>
>;

/**
 * The area that listens for right click / long press. Renders a block-level
 * `<div>` wrapping its children; pass `render` to use your own element.
 */
const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Trigger
        ref={ref}
        className={cx('zest-context-menu__trigger', className)}
        {...props}
      />
    );
  }
);

export interface ContextMenuContentProps extends WithClassName<
  React.ComponentProps<typeof BaseContextMenu.Popup>
> {
  /**
   * Distance from the anchor in px. The root menu anchors to the pointer;
   * inside a `SubmenuRoot` it anchors to the submenu trigger.
   */
  sideOffset?: number;
  children?: React.ReactNode;
}

/**
 * Portal + Positioner + Popup. Unlike `Menu.Content` it sets no side/align
 * defaults: the root popup follows the pointer (Base UI default) and, inside
 * `ContextMenu.SubmenuRoot`, it opens beside the trigger.
 */
const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ sideOffset, className, children, ...props }, ref) {
    return (
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner sideOffset={sideOffset} className="zest-menu__positioner">
          <BaseContextMenu.Popup ref={ref} className={cx('zest-menu__popup', className)} {...props}>
            {children}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    );
  }
);

export type ContextMenuItemProps = MenuItemProps;
export type ContextMenuSeparatorProps = MenuSeparatorProps;
export type ContextMenuGroupProps = MenuGroupProps;
export type ContextMenuGroupLabelProps = MenuGroupLabelProps;
export type ContextMenuSubmenuRootProps = MenuSubmenuRootProps;
export type ContextMenuSubmenuTriggerProps = MenuSubmenuTriggerProps;
export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps;
export type ContextMenuRadioGroupProps = MenuRadioGroupProps;
export type ContextMenuRadioItemProps = MenuRadioItemProps;

/**
 * Right-click / long-press menu positioned at the pointer. Shares every row
 * part (and the `zest-menu__*` styling) with `Menu`.
 *
 * ```tsx
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>Right-click me</ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item onClick={copy}><CopyIcon /> Copy</ContextMenu.Item>
 *     <ContextMenu.SubmenuRoot>
 *       <ContextMenu.SubmenuTrigger>Share</ContextMenu.SubmenuTrigger>
 *       <ContextMenu.Content><ContextMenu.Item>Email</ContextMenu.Item></ContextMenu.Content>
 *     </ContextMenu.SubmenuRoot>
 *     <ContextMenu.CheckboxItem defaultChecked>Show hidden files</ContextMenu.CheckboxItem>
 *     <ContextMenu.RadioGroup defaultValue="name">
 *       <ContextMenu.RadioItem value="name">Sort by name</ContextMenu.RadioItem>
 *     </ContextMenu.RadioGroup>
 *     <ContextMenu.Separator />
 *     <ContextMenu.Item destructive><TrashIcon /> Delete</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu.Root>
 * ```
 */
export const ContextMenu = {
  Root: BaseContextMenu.Root,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: Menu.Item,
  Separator: Menu.Separator,
  Group: Menu.Group,
  GroupLabel: Menu.GroupLabel,
  SubmenuRoot: Menu.SubmenuRoot,
  SubmenuTrigger: Menu.SubmenuTrigger,
  CheckboxItem: Menu.CheckboxItem,
  RadioGroup: Menu.RadioGroup,
  RadioItem: Menu.RadioItem,
};
