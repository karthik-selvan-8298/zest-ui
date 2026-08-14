import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from '../../utils';
import './Tooltip.css';

export interface TooltipProps {
  /** Tooltip text. */
  title: React.ReactNode;
  /** The element the tooltip describes. */
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in ms before opening on hover. */
  delay?: number;
  /** Show an arrow pointing at the anchor. */
  arrow?: boolean;
  className?: string;
}

/**
 * Tooltip on Base UI — hover/focus behavior, positioning, and accessible
 * labeling handled by the primitive.
 *
 * ```tsx
 * <Tooltip title="Delete"><IconButton aria-label="Delete">…</IconButton></Tooltip>
 * ```
 */
export function Tooltip({
  title,
  children,
  side = 'top',
  delay = 300,
  arrow = true,
  className,
}: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={delay} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="zest-tooltip__positioner">
          <BaseTooltip.Popup className={cx('zest-tooltip', className)}>
            {arrow ? (
              <BaseTooltip.Arrow className="zest-tooltip__arrow">
                <svg width="12" height="6" viewBox="0 0 12 6" fill="currentColor">
                  <path d="M0 0 L6 6 L12 0 Z" />
                </svg>
              </BaseTooltip.Arrow>
            ) : null}
            {title}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

/** App-level provider that lets nearby tooltips share timing. Optional. */
export const TooltipProvider = BaseTooltip.Provider;
