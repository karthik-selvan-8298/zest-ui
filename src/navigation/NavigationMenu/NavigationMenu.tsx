import * as React from 'react';
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { ChevronDownIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './NavigationMenu.css';

/*
 * Site / product navigation on Base UI NavigationMenu — hover + click
 * flyouts, keyboard navigation and aria wiring come from the primitive.
 * Root renders the Portal → Positioner → Popup → Viewport chain internally,
 * so consumers only compose List / Item / Trigger / Content / Link.
 *
 * <NavigationMenu.Root>
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item>
 *       <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
 *       <NavigationMenu.Content>
 *         <NavigationMenu.Link href="/crm" description="Sell smarter">CRM</NavigationMenu.Link>
 *         <NavigationMenu.Link render={<RouterLink to="/desk" />}>Desk</NavigationMenu.Link>
 *       </NavigationMenu.Content>
 *     </NavigationMenu.Item>
 *     <NavigationMenu.Item>
 *       <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 * </NavigationMenu.Root>
 */

export interface NavigationMenuRootProps extends WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.Root>
> {
  /** Which side of the active trigger the flyout opens on. Defaults to `bottom`. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment of the flyout along the trigger. Defaults to `start`. */
  align?: 'start' | 'center' | 'end';
  /** Gap between the trigger and the flyout in pixels. Defaults to `8`. */
  sideOffset?: number;
  /** Render a small pointer arrow on the flyout. Defaults to `false`. */
  arrow?: boolean;
  children?: React.ReactNode;
}

const NavigationMenuRoot = React.forwardRef<HTMLElement, NavigationMenuRootProps>(
  function NavigationMenuRoot(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 8,
      arrow = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <BaseNavigationMenu.Root
        ref={ref}
        className={cx('zest-navigation-menu', className)}
        {...props}
      >
        {children}
        <BaseNavigationMenu.Portal>
          <BaseNavigationMenu.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
            className="zest-navigation-menu__positioner"
          >
            <BaseNavigationMenu.Popup className="zest-navigation-menu__popup">
              {arrow ? <BaseNavigationMenu.Arrow className="zest-navigation-menu__arrow" /> : null}
              <BaseNavigationMenu.Viewport className="zest-navigation-menu__viewport" />
            </BaseNavigationMenu.Popup>
          </BaseNavigationMenu.Positioner>
        </BaseNavigationMenu.Portal>
      </BaseNavigationMenu.Root>
    );
  }
);

export type NavigationMenuListProps = WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.List>
>;

const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  function NavigationMenuList({ className, ...props }, ref) {
    return (
      <BaseNavigationMenu.List
        ref={ref}
        className={cx('zest-navigation-menu__list', className)}
        {...props}
      />
    );
  }
);

export type NavigationMenuItemProps = WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.Item>
>;

const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ className, ...props }, ref) {
    return (
      <BaseNavigationMenu.Item
        ref={ref}
        className={cx('zest-navigation-menu__item', className)}
        {...props}
      />
    );
  }
);

export interface NavigationMenuTriggerProps extends WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.Trigger>
> {
  /** Hide the rotating chevron. Defaults to `false`. */
  hideChevron?: boolean;
}

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  function NavigationMenuTrigger({ hideChevron = false, className, children, ...props }, ref) {
    return (
      <BaseNavigationMenu.Trigger
        ref={ref}
        className={cx('zest-navigation-menu__trigger', 'zest-focusable', className)}
        {...props}
      >
        {children}
        {hideChevron ? null : (
          <BaseNavigationMenu.Icon className="zest-navigation-menu__chevron">
            <ChevronDownIcon />
          </BaseNavigationMenu.Icon>
        )}
      </BaseNavigationMenu.Trigger>
    );
  }
);

export type NavigationMenuIconProps = WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.Icon>
>;

/** Wraps any indicator so it picks up `[data-popup-open]` from the active trigger. */
const NavigationMenuIcon = React.forwardRef<HTMLSpanElement, NavigationMenuIconProps>(
  function NavigationMenuIcon({ className, ...props }, ref) {
    return (
      <BaseNavigationMenu.Icon
        ref={ref}
        className={cx('zest-navigation-menu__icon', className)}
        {...props}
      />
    );
  }
);

export type NavigationMenuContentProps = WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.Content>
>;

const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  function NavigationMenuContent({ className, ...props }, ref) {
    return (
      <BaseNavigationMenu.Content
        ref={ref}
        className={cx('zest-navigation-menu__content', className)}
        {...props}
      />
    );
  }
);

export interface NavigationMenuLinkProps extends WithClassName<
  React.ComponentProps<typeof BaseNavigationMenu.Link>
> {
  /** Secondary line rendered under the label in the small secondary tone. */
  description?: React.ReactNode;
}

/**
 * A navigation row. Pass `render={<RouterLink to="…" />}` for client-side
 * routing; `active` marks the current page; `closeOnClick` dismisses the flyout.
 */
const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  function NavigationMenuLink({ description, className, children, ...props }, ref) {
    return (
      <BaseNavigationMenu.Link
        ref={ref}
        className={cx('zest-navigation-menu__link', 'zest-focusable', className)}
        {...props}
      >
        {description === undefined ? (
          children
        ) : (
          <>
            <span className="zest-navigation-menu__link-label">{children}</span>
            <span className="zest-navigation-menu__link-description">{description}</span>
          </>
        )}
      </BaseNavigationMenu.Link>
    );
  }
);

export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Icon: NavigationMenuIcon,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
};
