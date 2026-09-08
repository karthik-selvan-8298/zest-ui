import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { CheckIcon, ChevronRightIcon } from '../../icons';
import '../../base.css';
import '../Menu/Menu.css';
import './ContextMenu.css';

/*
 * ContextMenu on Base UI — opens on right click or long press, positioned at
 * the pointer. Shares the popup/row recipe with Menu (same `zest-menu__*`
 * classes) and adds submenus, checkbox items and radio items.
 *
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>Right-click me</ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item onClick={…}><CopyIcon /> Copy</ContextMenu.Item>
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
 * Portal + Positioner + Popup. The root popup follows the pointer (Base UI
 * default); used inside `ContextMenu.SubmenuRoot` it opens beside the trigger.
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

export interface ContextMenuItemProps extends WithClassName<
  React.ComponentProps<typeof BaseContextMenu.Item>
> {
  /** Styles the item with the error tone for irreversible actions. */
  destructive?: boolean;
}

const ContextMenuItem = React.forwardRef<HTMLElement, ContextMenuItemProps>(
  function ContextMenuItem({ destructive = false, className, ...props }, ref) {
    return (
      <BaseContextMenu.Item
        ref={ref}
        className={cx('zest-menu__item', className)}
        data-destructive={destructive ? '' : undefined}
        {...props}
      />
    );
  }
);

export type ContextMenuSeparatorProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.Separator>
>;

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Separator
        ref={ref}
        className={cx('zest-menu__separator', className)}
        {...props}
      />
    );
  }
);

export type ContextMenuGroupProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.Group>
>;

const ContextMenuGroup = React.forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  function ContextMenuGroup({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Group ref={ref} className={cx('zest-menu__group', className)} {...props} />
    );
  }
);

export type ContextMenuGroupLabelProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.GroupLabel>
>;

const ContextMenuGroupLabel = React.forwardRef<HTMLDivElement, ContextMenuGroupLabelProps>(
  function ContextMenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseContextMenu.GroupLabel
        ref={ref}
        className={cx('zest-menu__group-label', className)}
        {...props}
      />
    );
  }
);

export type ContextMenuSubmenuRootProps = React.ComponentProps<typeof BaseContextMenu.SubmenuRoot>;

export type ContextMenuSubmenuTriggerProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.SubmenuTrigger>
>;

/** A row that opens a nested menu. Renders a trailing chevron automatically. */
const ContextMenuSubmenuTrigger = React.forwardRef<HTMLElement, ContextMenuSubmenuTriggerProps>(
  function ContextMenuSubmenuTrigger({ className, children, ...props }, ref) {
    return (
      <BaseContextMenu.SubmenuTrigger
        ref={ref}
        className={cx('zest-menu__item', className)}
        {...props}
      >
        {children}
        <span className="zest-menu__submenu-chevron" aria-hidden>
          <ChevronRightIcon size={16} />
        </span>
      </BaseContextMenu.SubmenuTrigger>
    );
  }
);

export type ContextMenuCheckboxItemProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.CheckboxItem>
>;

/**
 * A row that toggles a setting. `checked` / `defaultChecked` /
 * `onCheckedChange` come from Base UI; a check mark shows when ticked.
 */
const ContextMenuCheckboxItem = React.forwardRef<HTMLElement, ContextMenuCheckboxItemProps>(
  function ContextMenuCheckboxItem({ className, children, ...props }, ref) {
    return (
      <BaseContextMenu.CheckboxItem
        ref={ref}
        className={cx('zest-menu__item', className)}
        {...props}
      >
        <span className="zest-menu__item-indicator" aria-hidden>
          <BaseContextMenu.CheckboxItemIndicator>
            <CheckIcon size={16} />
          </BaseContextMenu.CheckboxItemIndicator>
        </span>
        {children}
      </BaseContextMenu.CheckboxItem>
    );
  }
);

export type ContextMenuRadioGroupProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.RadioGroup>
>;

/** Groups `RadioItem`s; `value` / `defaultValue` / `onValueChange` select one. */
const ContextMenuRadioGroup = React.forwardRef<HTMLDivElement, ContextMenuRadioGroupProps>(
  function ContextMenuRadioGroup({ className, ...props }, ref) {
    return (
      <BaseContextMenu.RadioGroup
        ref={ref}
        className={cx('zest-menu__radio-group', className)}
        {...props}
      />
    );
  }
);

export type ContextMenuRadioItemProps = WithClassName<
  React.ComponentProps<typeof BaseContextMenu.RadioItem>
>;

/** A row that works like a radio button inside `RadioGroup`; shows a dot when selected. */
const ContextMenuRadioItem = React.forwardRef<HTMLElement, ContextMenuRadioItemProps>(
  function ContextMenuRadioItem({ className, children, ...props }, ref) {
    return (
      <BaseContextMenu.RadioItem ref={ref} className={cx('zest-menu__item', className)} {...props}>
        <span className="zest-menu__item-indicator" aria-hidden>
          <BaseContextMenu.RadioItemIndicator className="zest-menu__radio-dot" />
        </span>
        {children}
      </BaseContextMenu.RadioItem>
    );
  }
);

export const ContextMenu = {
  Root: BaseContextMenu.Root,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  SubmenuRoot: BaseContextMenu.SubmenuRoot,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
};
