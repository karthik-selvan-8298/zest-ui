import * as React from 'react';
import { CloseIcon } from '../../icons';
import { cx } from '../../utils';
import type { ZestColor } from '../../types';
import '../../base.css';
import './Chip.css';

/*
 * Chip — compact pill for tags, filters and selections.
 *
 * <Chip label="Design" />
 * <Chip label="Filter" variant="outlined" onDelete={remove} />
 * <Chip label="Choose me" clickable onClick={select} />
 * <Chip avatar={<Avatar name="Ada" size="xs" />} label="Ada" />
 */

export type ChipVariant = 'soft' | 'solid' | 'outlined';
export type ChipSize = 'sm' | 'md';

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color' | 'onClick'> {
  /** Chip text (children is an alias). */
  label?: React.ReactNode;
  variant?: ChipVariant;
  color?: ZestColor;
  size?: ChipSize;
  /** Leading icon slot. */
  startIcon?: React.ReactNode;
  /** Leading avatar slot (sized to nest inside the pill). */
  avatar?: React.ReactNode;
  /** Renders a small remove button when set. */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Hover/active affordance; implied by `onClick`. */
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Chip = React.forwardRef<HTMLElement, ChipProps>(function Chip(
  {
    label,
    variant = 'soft',
    color = 'neutral',
    size = 'md',
    startIcon,
    avatar,
    onDelete,
    clickable,
    onClick,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  const isClickable = clickable ?? onClick !== undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  const content = (
    <>
      {avatar ? <span className="zest-chip__avatar">{avatar}</span> : null}
      {startIcon ? (
        <span className="zest-chip__icon" aria-hidden>
          {startIcon}
        </span>
      ) : null}
      <span className="zest-chip__label">{label ?? children}</span>
      {onDelete ? (
        <button
          type="button"
          className="zest-chip__delete zest-focusable"
          aria-label="Remove"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(event);
          }}
        >
          <CloseIcon />
        </button>
      ) : null}
    </>
  );

  const sharedProps = {
    className: cx('zest-chip', isClickable && 'zest-focusable', className),
    'data-variant': variant,
    'data-accent': color,
    'data-size': size,
    'data-clickable': isClickable ? '' : undefined,
  };

  // A real <button> cannot nest the delete <button>; fall back to
  // role="button" + keyboard handling when both are present.
  if (isClickable && !onDelete) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        {...sharedProps}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  const interactiveProps =
    isClickable && !disabled
      ? {
          role: 'button' as const,
          tabIndex: 0,
          onClick: handleClick,
          onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClick?.(event);
            }
          },
        }
      : isClickable
        ? { role: 'button' as const, 'aria-disabled': true }
        : {};

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-disabled={disabled ? '' : undefined}
      {...interactiveProps}
      {...sharedProps}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  );
});
