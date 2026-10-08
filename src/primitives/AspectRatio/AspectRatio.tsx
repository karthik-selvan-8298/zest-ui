import * as React from 'react';
import { cx } from '../../utils';
import './AspectRatio.css';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width ÷ height, e.g. `16 / 9`. @default 16 / 9 */
  ratio?: number;
}

/**
 * Locks its box to a width/height ratio and clips overflowing content — for
 * media frames, embeds and placeholder tiles. Width comes from the parent;
 * height follows the ratio.
 *
 * ```tsx
 * <AspectRatio ratio={4 / 3}>
 *   <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, className, style, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx('zest-aspect-ratio', className)}
      // The ratio is per-instance, so it stays inline; `style` may override it.
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  );
});
