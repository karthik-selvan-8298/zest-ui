import * as React from 'react';
import {
  PreviewCard as BasePreviewCard,
  type PreviewCardRootProps as BasePreviewCardRootProps,
  type PreviewCardTriggerProps as BasePreviewCardTriggerProps,
} from '@base-ui/react/preview-card';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './PreviewCard.css';

/*
 * Hover card for link previews and user cards on Base UI Preview Card.
 *
 * <PreviewCard.Root>
 *   <PreviewCard.Trigger href="/users/ada">@ada</PreviewCard.Trigger>
 *   <PreviewCard.Content side="bottom" arrow>…</PreviewCard.Content>
 * </PreviewCard.Root>
 */

interface PreviewCardTiming {
  /** Delay in ms before the card opens on hover. Defaults to 600. */
  delay?: number;
  /** Delay in ms before the card closes once the pointer leaves. Defaults to 300. */
  closeDelay?: number;
}

const TimingContext = React.createContext<PreviewCardTiming>({});

export interface PreviewCardRootProps extends BasePreviewCardRootProps, PreviewCardTiming {}

/**
 * Root — owns open state. `delay` / `closeDelay` set here apply to every
 * Trigger inside (a Trigger's own props take precedence).
 */
function PreviewCardRoot({ delay, closeDelay, ...props }: PreviewCardRootProps) {
  const timing = React.useMemo(() => ({ delay, closeDelay }), [delay, closeDelay]);
  return (
    <TimingContext.Provider value={timing}>
      <BasePreviewCard.Root {...props} />
    </TimingContext.Provider>
  );
}

export type PreviewCardTriggerProps = WithClassName<BasePreviewCardTriggerProps>;

/**
 * Trigger — renders an `<a>` by default (a preview card is a link preview);
 * pass `render` to use another element.
 */
const PreviewCardTrigger = React.forwardRef<HTMLAnchorElement, PreviewCardTriggerProps>(
  function PreviewCardTrigger({ className, delay, closeDelay, ...props }, ref) {
    const timing = React.useContext(TimingContext);
    return (
      <BasePreviewCard.Trigger
        ref={ref}
        className={cx('zest-preview-card__trigger', 'zest-focusable', className)}
        delay={delay ?? timing.delay}
        closeDelay={closeDelay ?? timing.closeDelay}
        {...props}
      />
    );
  }
);

export interface PreviewCardContentProps extends WithClassName<
  React.ComponentProps<typeof BasePreviewCard.Popup>
> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  /** Gap between the anchor and the card, in px. Defaults to 8. */
  sideOffset?: number;
  /** Show an arrow pointing at the anchor. */
  arrow?: boolean;
  children?: React.ReactNode;
}

/** Content — Portal → Positioner → Popup with the Popover surface recipe. */
const PreviewCardContent = React.forwardRef<HTMLDivElement, PreviewCardContentProps>(
  function PreviewCardContent(
    {
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      arrow = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <BasePreviewCard.Portal>
        <BasePreviewCard.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="zest-preview-card__positioner"
        >
          <BasePreviewCard.Popup
            ref={ref}
            className={cx('zest-preview-card', className)}
            {...props}
          >
            {arrow ? (
              <BasePreviewCard.Arrow className="zest-preview-card__arrow">
                <svg width="12" height="6" viewBox="0 0 12 6" fill="currentColor">
                  <path d="M0 0 L6 6 L12 0 Z" />
                </svg>
              </BasePreviewCard.Arrow>
            ) : null}
            {children}
          </BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    );
  }
);

export const PreviewCard = {
  Root: PreviewCardRoot,
  Trigger: PreviewCardTrigger,
  Content: PreviewCardContent,
};
