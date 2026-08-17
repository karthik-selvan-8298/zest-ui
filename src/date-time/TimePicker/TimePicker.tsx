import * as React from 'react';
import { SelectPrimitive } from '../../forms/Select/Select';
import { CheckIcon, ChevronDownIcon, ClockIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './TimePicker.css';

export interface TimePickerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'name'
  > {
  /** Selected time as "HH:mm" (controlled). */
  value?: string | null;
  /** Initially selected time (uncontrolled). */
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Minutes between generated options. Defaults to 30. */
  step?: number;
  /** Earliest selectable time, "HH:mm" inclusive. */
  minTime?: string;
  /** Latest selectable time, "HH:mm" inclusive. */
  maxTime?: string;
  placeholder?: React.ReactNode;
  /** Field size. Defaults to `md`. */
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  /** 12-hour clock display. Defaults to the locale's convention. */
  hour12?: boolean;
  /** BCP 47 locale for time formatting. Defaults to the browser locale. */
  locale?: string;
  name?: string;
}

function parseTime(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTimeValue(totalMinutes: number): string {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Time-of-day picker: a Select (Base UI parts, field look shared with the
 * Zest Select) over generated "HH:mm" options, with a clock adornment.
 * Values cross the API as plain "HH:mm" strings.
 *
 * ```tsx
 * <TimePicker step={15} minTime="09:00" maxTime="17:00" />
 * ```
 */
export const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
  {
    value,
    defaultValue,
    onValueChange,
    step = 30,
    minTime = '00:00',
    maxTime = '23:59',
    placeholder = 'Select time',
    size = 'md',
    error,
    fullWidth,
    disabled,
    hour12,
    locale,
    name,
    className,
    ...triggerProps
  },
  ref
) {
  const timeFormatter = React.useMemo(() => {
    const localeHour12 = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions()
      .hour12;
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: hour12 ?? localeHour12,
    });
  }, [locale, hour12]);

  const formatTime = React.useCallback(
    (time: string) => {
      const total = parseTime(time);
      return timeFormatter.format(new Date(2000, 0, 1, Math.floor(total / 60), total % 60));
    },
    [timeFormatter]
  );

  const options = React.useMemo(() => {
    const from = parseTime(minTime);
    const to = parseTime(maxTime);
    const result: Array<{ value: string; label: string }> = [];
    for (let minutes = from; minutes <= to; minutes += Math.max(1, step)) {
      const time = toTimeValue(minutes);
      result.push({ value: time, label: formatTime(time) });
    }
    return result;
  }, [minTime, maxTime, step, formatTime]);

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as (value: unknown) => void}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        ref={ref}
        className={cx('zest-select__trigger', 'zest-time-picker', 'zest-focusable', className)}
        data-size={size}
        data-error={error ? '' : undefined}
        data-full-width={fullWidth ? '' : undefined}
        {...triggerProps}
      >
        <span className="zest-time-picker__clock">
          <ClockIcon />
        </span>
        <SelectPrimitive.Value className="zest-select__value zest-time-picker__value">
          {(current: string | null) =>
            current ? (
              formatTime(current)
            ) : (
              <span className="zest-select__placeholder">{placeholder}</span>
            )
          }
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon className="zest-select__icon">
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          className="zest-select__positioner"
          side="bottom"
          align="start"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <SelectPrimitive.Popup className="zest-select__popup zest-time-picker__popup">
            <SelectPrimitive.List className="zest-select__list">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="zest-select__item"
                >
                  <SelectPrimitive.ItemText className="zest-select__item-text">
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="zest-select__item-indicator">
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});
