import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import { CheckIcon, ChevronRightIcon } from '../../icons';
import '../../base.css';
import './Menu.css';

export type MenuRootProps = React.ComponentProps<typeof BaseMenu.Root>;

export interface MenuContentProps extends WithClassName<
  React.ComponentProps<typeof BaseMenu.Popup>
> {
  /**
   * Side of the anchor the popup opens on. Defaults to `bottom` for a root
   * menu and beside the trigger (`inline-end`) inside a `SubmenuRoot`.
   */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  /** Alignment of the popup along the anchor. Defaults to `start`. */
  align?: 'start' | 'center' | 'end';
  /** Gap between the anchor and the popup in px. Defaults to `4`. */
  sideOffset?: number;
  children?: React.ReactNode;
}

/**
 * Portal + Positioner + Popup in one part. Also used as the popup of a
 * `SubmenuRoot`, where it opens beside its trigger.
 */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(
  { side, align = 'start', sideOffset = 4, className, children, ...props },
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

/** An actionable row. Leading icons go straight into `children`. */
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

/** Hairline divider between groups of rows. */
const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(function MenuSeparator(
  { className, ...props },
  ref
) {
  return (
    <BaseMenu.Separator ref={ref} className={cx('zest-menu__separator', className)} {...props} />
  );
});

export type MenuGroupProps = WithClassName<React.ComponentProps<typeof BaseMenu.Group>>;

/** Groups related rows; label it with `GroupLabel` for screen readers. */
const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(function MenuGroup(
  { className, ...props },
  ref
) {
  return <BaseMenu.Group ref={ref} className={cx('zest-menu__group', className)} {...props} />;
});

export type MenuGroupLabelProps = WithClassName<React.ComponentProps<typeof BaseMenu.GroupLabel>>;

/** Small secondary heading for a `Group`. */
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

export type MenuSubmenuRootProps = React.ComponentProps<typeof BaseMenu.SubmenuRoot>;

export type MenuSubmenuTriggerProps = WithClassName<
  React.ComponentProps<typeof BaseMenu.SubmenuTrigger>
>;

/** A row that opens a nested menu. Renders a trailing chevron automatically. */
const MenuSubmenuTrigger = React.forwardRef<HTMLElement, MenuSubmenuTriggerProps>(
  function MenuSubmenuTrigger({ className, children, ...props }, ref) {
    return (
      <BaseMenu.SubmenuTrigger ref={ref} className={cx('zest-menu__item', className)} {...props}>
        {children}
        <span className="zest-menu__submenu-chevron" aria-hidden>
          <ChevronRightIcon size={16} />
        </span>
      </BaseMenu.SubmenuTrigger>
    );
  }
);

export type MenuCheckboxItemProps = WithClassName<
  React.ComponentProps<typeof BaseMenu.CheckboxItem>
>;

/**
 * A row that toggles a setting. `checked` / `defaultChecked` /
 * `onCheckedChange` come from Base UI; a check mark shows when ticked.
 */
const MenuCheckboxItem = React.forwardRef<HTMLElement, MenuCheckboxItemProps>(
  function MenuCheckboxItem({ className, children, ...props }, ref) {
    return (
      <BaseMenu.CheckboxItem ref={ref} className={cx('zest-menu__item', className)} {...props}>
        <span className="zest-menu__item-indicator" aria-hidden>
          <BaseMenu.CheckboxItemIndicator>
            <CheckIcon size={16} />
          </BaseMenu.CheckboxItemIndicator>
        </span>
        {children}
      </BaseMenu.CheckboxItem>
    );
  }
);

export type MenuRadioGroupProps = WithClassName<React.ComponentProps<typeof BaseMenu.RadioGroup>>;

/** Groups `RadioItem`s; `value` / `defaultValue` / `onValueChange` select one. */
const MenuRadioGroup = React.forwardRef<HTMLDivElement, MenuRadioGroupProps>(
  function MenuRadioGroup({ className, ...props }, ref) {
    return (
      <BaseMenu.RadioGroup
        ref={ref}
        className={cx('zest-menu__radio-group', className)}
        {...props}
      />
    );
  }
);

export type MenuRadioItemProps = WithClassName<React.ComponentProps<typeof BaseMenu.RadioItem>>;

/** A row that works like a radio button inside `RadioGroup`; shows a dot when selected. */
const MenuRadioItem = React.forwardRef<HTMLElement, MenuRadioItemProps>(function MenuRadioItem(
  { className, children, ...props },
  ref
) {
  return (
    <BaseMenu.RadioItem ref={ref} className={cx('zest-menu__item', className)} {...props}>
      <span className="zest-menu__item-indicator" aria-hidden>
        <BaseMenu.RadioItemIndicator className="zest-menu__radio-dot" />
      </span>
      {children}
    </BaseMenu.RadioItem>
  );
});

/**
 * Dropdown menu on Base UI — keyboard navigation, typeahead and ARIA wiring
 * come from the primitive. ContextMenu and Menubar reuse these parts, so the
 * popup/row recipe (`zest-menu__*`) is defined once, in Menu.css.
 *
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger render={<Button variant="outlined">Actions</Button>} />
 *   <Menu.Content>
 *     <Menu.Item onClick={rename}><EditIcon /> Rename</Menu.Item>
 *     <Menu.SubmenuRoot>
 *       <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
 *       <Menu.Content><Menu.Item>Email</Menu.Item></Menu.Content>
 *     </Menu.SubmenuRoot>
 *     <Menu.CheckboxItem defaultChecked>Compact rows</Menu.CheckboxItem>
 *     <Menu.RadioGroup defaultValue="light">
 *       <Menu.RadioItem value="light">Light</Menu.RadioItem>
 *     </Menu.RadioGroup>
 *     <Menu.Separator />
 *     <Menu.Item destructive><TrashIcon /> Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */
export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  SubmenuRoot: BaseMenu.SubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
};
