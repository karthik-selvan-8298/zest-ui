import * as React from 'react';
import { cx, spawnRipple } from '../../utils';
import type { ZestColor } from '../../types';
import type { ButtonProps, ButtonVariant } from './Button.types';
import '../../base.css';
import './Button.css';

function resolveVariant(
  variant: ButtonVariant,
  color: ZestColor | undefined
): { variant: 'solid' | 'outlined' | 'ghost' | 'soft'; color: ZestColor } {
  if (variant === 'primary') return { variant: 'solid', color: color ?? 'primary' };
  if (variant === 'danger') return { variant: 'solid', color: color ?? 'error' };
  return { variant, color: color ?? 'primary' };
}

/**
 * Zest Button.
 *
 * ```tsx
 * <Button variant="solid" color="primary" size="md">Save</Button>
 * <Button variant="outlined" startIcon={<PlusIcon />}>Add</Button>
 * <Button loading>Saving…</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props: ButtonProps<React.ElementType>, ref) {
    const {
      variant: variantProp = 'solid',
      color: colorProp,
      size = 'md',
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      fullWidth = false,
      href,
      as,
      className,
      children,
      type,
      onPointerDown,
      ...rest
    } = props as ButtonProps<'button'> & { as?: React.ElementType; href?: string };
    const { variant, color } = resolveVariant(variantProp, colorProp);
    const isDisabled = disabled || loading;

    const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
      if (!isDisabled) spawnRipple(event.currentTarget, event);
      onPointerDown?.(event as React.PointerEvent<HTMLButtonElement & HTMLAnchorElement>);
    };

    const sharedProps = {
      className: cx('zest-button', 'zest-focusable', 'zest-ripple-host', className),
      onPointerDown: handlePointerDown,
      'data-variant': variant,
      'data-accent': color,
      'data-size': size,
      'data-loading': loading ? '' : undefined,
      'data-full-width': fullWidth ? '' : undefined,
    };

    const content = (
      <>
        {loading ? (
          <span className="zest-button__spinner" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : null}
        {startIcon ? (
          <span className="zest-button__icon" aria-hidden>
            {startIcon}
          </span>
        ) : null}
        <span className="zest-button__label">{children}</span>
        {endIcon ? (
          <span className="zest-button__icon" aria-hidden>
            {endIcon}
          </span>
        ) : null}
      </>
    );

    if (as && !isDisabled) {
      const Component = as as React.ElementType;
      return (
        <Component ref={ref as React.Ref<unknown>} href={href} {...sharedProps} {...rest}>
          {content}
        </Component>
      );
    }

    if (href !== undefined && !isDisabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          {...sharedProps}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...sharedProps}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
) as <E extends React.ElementType = 'button'>(
  props: ButtonProps<E> & { ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement> }
) => React.ReactElement;
