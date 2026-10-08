import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cx } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Slider.css';

interface SliderBaseProps extends WithClassName<
  Omit<React.ComponentProps<typeof BaseSlider.Root>, 'color' | 'aria-labelledby'>
> {
  /** Tone of the filled indicator and thumb ring. Defaults to `primary`. */
  color?: ZestColor;
  /** Control size. Defaults to `md`. */
  size?: 'sm' | 'md';
  /** Renders the formatted value next to the control. */
  showValue?: boolean;
}

/**
 * A slider has no text of its own, so `aria-label` or `aria-labelledby` is
 * required. When composed inside `FormField` with a `Label`, pass the label's
 * id via `aria-labelledby`.
 */
export type SliderProps = SliderBaseProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-label'?: string; 'aria-labelledby': string }
  );

/**
 * Slider on Base UI — single value or range (pass an array `value` /
 * `defaultValue` to get one thumb per entry).
 *
 * ```tsx
 * <Slider aria-label="Volume" defaultValue={30} showValue />
 * <Slider aria-label="Price range" defaultValue={[20, 80]} color="secondary" />
 * ```
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    color = 'primary',
    size = 'md',
    showValue = false,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
  },
  ref
) {
  // One thumb per entry of an array value (range slider), else a single thumb.
  const currentValue = props.value ?? props.defaultValue;
  const thumbCount = Array.isArray(currentValue) ? currentValue.length : 1;

  return (
    <BaseSlider.Root
      ref={ref}
      className={cx('zest-slider', className)}
      data-accent={color}
      data-size={size}
      aria-labelledby={ariaLabelledby}
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
              // The thumb hosts the real <input type="range">, so the name
              // belongs here. Range sliders suffix the position so each
              // handle is distinguishable to assistive tech.
              aria-label={
                ariaLabel && thumbCount > 1
                  ? `${ariaLabel} ${index === 0 ? 'start' : index === thumbCount - 1 ? 'end' : index + 1}`
                  : ariaLabel
              }
              aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
      {showValue ? <BaseSlider.Value className="zest-slider__value" /> : null}
    </BaseSlider.Root>
  );
});
