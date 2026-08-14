import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Slider.css';

export interface SliderProps
  extends WithClassName<Omit<React.ComponentProps<typeof BaseSlider.Root>, 'color'>> {
  /** Tone of the filled indicator and thumb ring. Defaults to `primary`. */
  color?: ZestColor;
  /** Control size. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Renders the formatted value next to the control. */
  showValue?: boolean;
}

/**
 * Slider on Base UI — single value or range (pass an array `value` /
 * `defaultValue` to get one thumb per entry).
 *
 * ```tsx
 * <Slider defaultValue={30} showValue />
 * <Slider defaultValue={[20, 80]} color="secondary" />
 * ```
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { color = 'primary', size = 'md', showValue = false, className, ...props },
  ref
) {
  const currentValue = props.value ?? props.defaultValue;
  const thumbCount = Array.isArray(currentValue) ? currentValue.length : 1;

  return (
    <BaseSlider.Root
      ref={ref}
      className={cx('zest-slider', className)}
      data-accent={color}
      data-size={size}
      {...props}
    >
      <BaseSlider.Control className="zest-slider__control">
        <BaseSlider.Track className="zest-slider__track">
          <BaseSlider.Indicator className="zest-slider__indicator" />
          {Array.from({ length: thumbCount }, (_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={thumbCount > 1 ? index : undefined}
              className="zest-slider__thumb zest-focusable"
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
      {showValue ? <BaseSlider.Value className="zest-slider__value" /> : null}
    </BaseSlider.Root>
  );
});
