import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cx, useControllableState } from '../../utils';
import type { WithClassName, ZestColor } from '../../types';
import '../../base.css';
import './Segmented.css';

/*
 * Segmented — single-select segmented control on Base UI ToggleGroup.
 * Keyboard navigation (arrow keys), `role="group"` and `aria-pressed` come
 * from the primitive; Zest adds the track/pill look and a string value API
 * that can never be emptied.
 *
 * <Segmented aria-label="View" defaultValue="list"
 *   options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />
 *
 * or composed:
 *
 * <Segmented aria-label="Period" value={period} onValueChange={setPeriod}>
 *   <Segmented.Item value="day">Day</Segmented.Item>
 *   <Segmented.Item value="week">Week</Segmented.Item>
 * </Segmented>
 */

export type SegmentedVariant = 'solid' | 'soft';
export type SegmentedSize = 'sm' | 'md';

export interface SegmentedOption {
  /** Unique value reported through `onValueChange`. */
  value: string;
  /** Visible label. */
  label: React.ReactNode;
  /** Leading icon slot. */
  icon?: React.ReactNode;
  /** Disables this segment only. */
  disabled?: boolean;
}

export interface SegmentedItemProps extends WithClassName<
  Omit<
    React.ComponentProps<typeof BaseToggle>,
    'value' | 'pressed' | 'defaultPressed' | 'onPressedChange' | 'color'
  >
> {
  /** Unique value of this segment within the group. */
  value: string;
  /** Leading icon slot. Icon-only segments must also pass `aria-label`. */
  icon?: React.ReactNode;
  /** Segment label. */
  children?: React.ReactNode;
}

const SegmentedItem = React.forwardRef<HTMLButtonElement, SegmentedItemProps>(
  function SegmentedItem({ value, icon, className, children, ...props }, ref) {
    return (
      <BaseToggle
        ref={ref}
        value={value}
        className={cx('zest-segmented__item', 'zest-focusable', className)}
        {...props}
      >
        {icon ? (
          <span className="zest-segmented__icon" aria-hidden>
            {icon}
          </span>
        ) : null}
        {children !== undefined && children !== null ? (
          <span className="zest-segmented__label">{children}</span>
        ) : null}
      </BaseToggle>
    );
  }
);

export interface SegmentedProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'defaultValue'
> {
  /** Controlled selected value. */
  value?: string;
  /**
   * Initial selected value for uncontrolled usage.
   * Falls back to the first option/item so the control is never empty.
   */
  defaultValue?: string;
  /** Called with the newly selected value. Never called with an empty value. */
  onValueChange?: (value: string) => void;
  /** Segments as data. Alternative to composing `Segmented.Item` children. */
  options?: ReadonlyArray<SegmentedOption>;
  /**
   * `solid` fills the selected pill with the accent color;
   * `soft` tints it and colors the label instead. Defaults to `solid`.
   */
  variant?: SegmentedVariant;
  /** Accent tone for the selected pill. Defaults to `primary`. */
  color?: ZestColor;
  /** Control height (`--zest-button-height-sm/md`). Defaults to `md`. */
  size?: SegmentedSize;
  /** Stretch to the container width with equal-width segments. */
  fullWidth?: boolean;
  /** Disables every segment. */
  disabled?: boolean;
  /**
   * Describes the choice for screen readers (e.g. "View mode").
   * Strongly recommended — the group itself has no visible label.
   */
  'aria-label'?: string;
  /** `Segmented.Item` elements. Ignored when `options` is provided. */
  children?: React.ReactNode;
}

function firstValue(
  options: ReadonlyArray<SegmentedOption> | undefined,
  children: React.ReactNode
): string {
  if (options) return options[0]?.value ?? '';
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement<SegmentedItemProps>(child) && typeof child.props.value === 'string') {
      return child.props.value;
    }
  }
  return '';
}

/**
 * Single-select segmented control — the "List | Grid" / "Day | Week | Month"
 * switch. Sits in a bordered track like ButtonGroup with a sliding accent
 * pill on the selected segment. Exactly one segment is always selected.
 *
 * ```tsx
 * <Segmented
 *   aria-label="View"
 *   defaultValue="list"
 *   options={[
 *     { value: 'list', label: 'List', icon: <MenuIcon /> },
 *     { value: 'grid', label: 'Grid' },
 *   ]}
 *   onValueChange={setView}
 * />
 * ```
 */
const SegmentedRoot = React.forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  {
    value,
    defaultValue,
    onValueChange,
    options,
    variant = 'solid',
    color = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstValue(options, children),
    onChange: onValueChange,
  });

  const handleValueChange = (next: string[]) => {
    // Base UI emits [] when the pressed segment is clicked again; a segmented
    // control must always have a selection, so ignore that transition.
    const nextValue = next[0];
    if (nextValue === undefined || nextValue === selected) return;
    setSelected(nextValue);
  };

  return (
    <BaseToggleGroup
      ref={ref}
      multiple={false}
      value={[selected]}
      onValueChange={handleValueChange}
      disabled={disabled}
      className={cx('zest-segmented', className)}
      data-accent={color}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? '' : undefined}
      {...props}
    >
      {options
        ? options.map((option) => (
            <SegmentedItem
              key={option.value}
              value={option.value}
              icon={option.icon}
              disabled={option.disabled}
            >
              {option.label}
            </SegmentedItem>
          ))
        : children}
    </BaseToggleGroup>
  );
});

export const Segmented = Object.assign(SegmentedRoot, {
  Item: SegmentedItem,
});
