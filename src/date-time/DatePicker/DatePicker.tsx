import * as React from 'react';
import { Popover } from '../../overlays/Popover/Popover';
import { CalendarIcon, CloseIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import { Calendar } from '../Calendar/Calendar';
import '../../base.css';
import './DatePicker.css';

export interface DatePickerProps {
  /** Selected date (controlled). */
  value?: Date | null;
  /** Initially selected date (uncontrolled). */
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  /** Field size. Defaults to `md`. */
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Show a clear button when a date is set. */
  clearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  /** BCP 47 locale for the display format and calendar. Defaults to the browser locale. */
  locale?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Input-styled date field opening a Calendar in a Popover. Label-free —
 * compose with FormField for label/description/error wiring.
 *
 * ```tsx
 * <DatePicker placeholder="Due date" minDate={new Date()} clearable />
 * ```
 */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      defaultValue,
      onValueChange,
      placeholder = 'Pick a date',
      size = 'md',
      error,
      fullWidth,
      disabled,
      clearable,
      minDate,
      maxDate,
      disabledDates,
      locale,
      id,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) {
    const [date, setDate] = useControllableState<Date | null>({
      value,
      defaultValue: defaultValue ?? null,
      onChange: onValueChange,
    });
    const [open, setOpen] = React.useState(false);

    const formatter = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
      [locale]
    );

    return (
      <Popover.Root open={open} onOpenChange={(next) => setOpen(!disabled && next)}>
        <span
          className={cx('zest-date-picker', className)}
          data-size={size}
          data-error={error ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          data-full-width={fullWidth ? '' : undefined}
          data-open={open ? '' : undefined}
        >
          <Popover.Trigger
            ref={ref}
            id={id}
            aria-label={ariaLabel}
            disabled={disabled}
            className="zest-date-picker__trigger"
          >
            <span className="zest-date-picker__icon">
              <CalendarIcon />
            </span>
            {date ? (
              <span className="zest-date-picker__value">{formatter.format(date)}</span>
            ) : (
              <span className="zest-date-picker__placeholder">{placeholder}</span>
            )}
          </Popover.Trigger>
          {clearable && date && !disabled ? (
            <button
              type="button"
              className="zest-date-picker__clear zest-focusable"
              aria-label="Clear date"
              onClick={() => setDate(null)}
            >
              <CloseIcon />
            </button>
          ) : null}
        </span>
        <Popover.Content align="start" className="zest-date-picker__popup">
          <Calendar
            value={date}
            defaultMonth={date ?? undefined}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            locale={locale}
            onValueChange={(next) => {
              setDate(next);
              setOpen(false);
            }}
          />
        </Popover.Content>
      </Popover.Root>
    );
  }
);
