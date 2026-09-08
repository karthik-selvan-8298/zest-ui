import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './Toolbar.css';

/*
 * Accessible toolbar on Base UI Toolbar — `role="toolbar"`, `aria-orientation`
 * and arrow-key roving focus come from the primitive.
 *
 * Toolbar.Button is a focus-management shell: pass a Zest control through
 * `render` to give it a look, or leave `render` off for the built-in ghost
 * icon-button styling.
 *
 * <Toolbar.Root variant="contained" aria-label="Formatting">
 *   <Toolbar.Group>
 *     <Toolbar.Button render={<Toggle aria-label="Bold"><BoldIcon /></Toggle>} />
 *     <Toolbar.Button render={<Toggle aria-label="Italic"><ItalicIcon /></Toggle>} />
 *   </Toolbar.Group>
 *   <Toolbar.Separator />
 *   <Toolbar.Button render={<IconButton aria-label="Copy"><CopyIcon /></IconButton>} />
 *   <Toolbar.Button render={<Button variant="ghost">Share</Button>} />
 *   <Toolbar.Separator />
 *   <Toolbar.Input render={<Input size="sm" placeholder="Search" />} />
 * </Toolbar.Root>
 */

export interface ToolbarRootProps extends WithClassName<
  React.ComponentProps<typeof BaseToolbar.Root>
> {
  /** Layout axis. Also drives arrow-key direction. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Visual style:
   * - 'plain' (default): controls sit directly on the page
   * - 'contained': surface panel with a hairline ring and panel radius
   */
  variant?: 'plain' | 'contained';
}

const ToolbarRoot = React.forwardRef<HTMLDivElement, ToolbarRootProps>(function ToolbarRoot(
  { orientation = 'horizontal', variant = 'plain', className, ...props },
  ref
) {
  return (
    <BaseToolbar.Root
      ref={ref}
      orientation={orientation}
      className={cx('zest-toolbar', className)}
      data-variant={variant}
      {...props}
    />
  );
});

export type ToolbarGroupProps = WithClassName<React.ComponentProps<typeof BaseToolbar.Group>>;

const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(function ToolbarGroup(
  { className, ...props },
  ref
) {
  return (
    <BaseToolbar.Group ref={ref} className={cx('zest-toolbar__group', className)} {...props} />
  );
});

export type ToolbarButtonProps = WithClassName<React.ComponentProps<typeof BaseToolbar.Button>>;

/**
 * Toolbar item. Without `render` it draws as a ghost icon button; with
 * `render={<Button/>}`, `render={<IconButton/>}` or `render={<Toggle/>}` the
 * Zest control supplies the look and Base UI merges the roving-focus props in.
 */
const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton({ className, render, ...props }, ref) {
    const plain = render === undefined;
    return (
      <BaseToolbar.Button
        ref={ref}
        render={render}
        className={cx('zest-toolbar__button', plain && 'zest-focusable', className)}
        data-plain={plain ? '' : undefined}
        {...props}
      />
    );
  }
);

export type ToolbarSeparatorProps = WithClassName<
  React.ComponentProps<typeof BaseToolbar.Separator>
>;

/** Hairline rule. Orientation flips automatically with the toolbar's. */
const ToolbarSeparator = React.forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  function ToolbarSeparator({ className, ...props }, ref) {
    return (
      <BaseToolbar.Separator
        ref={ref}
        className={cx('zest-toolbar__separator', className)}
        {...props}
      />
    );
  }
);

export type ToolbarLinkProps = WithClassName<React.ComponentProps<typeof BaseToolbar.Link>>;

/** Anchor that joins the roving tab sequence. Pass `render` for router links. */
const ToolbarLink = React.forwardRef<HTMLAnchorElement, ToolbarLinkProps>(function ToolbarLink(
  { className, ...props },
  ref
) {
  return (
    <BaseToolbar.Link
      ref={ref}
      className={cx('zest-toolbar__link', 'zest-focusable', className)}
      {...props}
    />
  );
});

export type ToolbarInputProps = WithClassName<React.ComponentProps<typeof BaseToolbar.Input>>;

/**
 * Text field that joins the roving tab sequence (arrow keys move the caret
 * inside; Tab leaves the toolbar). Wrap the Zest field: `render={<Input/>}`.
 */
const ToolbarInput = React.forwardRef<HTMLInputElement, ToolbarInputProps>(function ToolbarInput(
  { className, ...props },
  ref
) {
  return (
    <BaseToolbar.Input ref={ref} className={cx('zest-toolbar__input', className)} {...props} />
  );
});

export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
  Input: ToolbarInput,
};
