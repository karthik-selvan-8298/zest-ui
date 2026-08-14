import * as React from 'react';
import { cx } from '../../utils';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** width / height, e.g. 16/9. */
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio({ ratio = 16 / 9, className, style, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cx('zest-aspect-ratio', className)}
        style={{ aspectRatio: String(ratio), overflow: 'hidden', ...style }}
        {...props}
      />
    );
  }
);
