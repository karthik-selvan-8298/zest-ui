import * as React from 'react';
import { Popover } from '../../overlays/Popover/Popover';
import { CalendarIcon, CloseIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import { Calendar } from '../Calendar/Calendar';
import { startOfDay } from '../dateUtils';
import '../../base.css';
// Reuses the zest-date-picker field shell — both pickers share one look.
import '../DatePicker/DatePicker.css';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  /** Selected range (controlled). */
  value?: DateRange;
  /** Initially selected range (uncontrolled). */
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  placeholder?: string;
  /** Field size. Defaults to `md`. */
  size?: 'sm' | 'md';
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Show a clear button when a range is set. */
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

const EMPTY_RANGE: DateRange = { start: null, end: null };

/**
 * Date-range field opening a single Calendar in range mode: the first click
 * sets the start, the second sets the end (swapped if earlier), and hovered
 * in-between days preview the range.
 *
 * ```tsx
 * <DateRangePicker placeholder="Trip dates" clearable />
 * ```
 */
export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value,
      defaultValue,
      onValueChange,
      placeholder = 'Pick a date range',
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
    const [range, setRange] = useControllableState<DateRange>({
      value,
      defaultValue: defaultValue ?? EMPTY_RANGE,
      onChange: onValueChange,
    });
    const [open, setOpen] = React.useState(false);
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

    const formatter = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }),
      [locale]
    );

    const handleDayClick = (day: Date) => {
      if (!range.start || range.end) {
        // Start a fresh range.
        setRange({ start: day, end: null });
        return;
      }
      // Commit the end — swap when the second click lands before the start.
      const swapped = startOfDay(day).getTime() < startOfDay(range.start).getTime();
      setRange(swapped ? { start: day, end: range.start } : { start: range.start, end: day });
      setHoverDate(null);
      setOpen(false);
    };

    const label =
      range.start && range.end
        ? formatter.formatRange(range.start, range.end)
        : range.start
          ? `${formatter.format(range.start)} –`
          : null;

    return (
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(!disabled && next);
          if (!next) setHoverDate(null);
        }}
      >
        <span
          className={cx('zest-date-picker', 'zest-date-range-picker', className)}
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
            {label ? (
              <span className="zest-date-picker__value">{label}</span>
            ) : (
              <span className="zest-date-picker__placeholder">{placeholder}</span>
            )}
          </Popover.Trigger>
          {clearable && range.start && !disabled ? (
            <button
              type="button"
              className="zest-date-picker__clear zest-focusable"
              aria-label="Clear date range"
              onClick={() => setRange(EMPTY_RANGE)}
            >
              <CloseIcon />
            </button>
          ) : null}
        </span>
        <Popover.Content align="start" className="zest-date-picker__popup">
          <Calendar
            value={null}
            defaultMonth={range.start ?? undefined}
            rangeStart={range.start}
            rangeEnd={range.end}
            rangeHover={range.end ? null : hoverDate}
            onDayHover={setHoverDate}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            locale={locale}
            onValueChange={(day) => {
              if (day) handleDayClick(day);
            }}
          />
        </Popover.Content>
      </Popover.Root>
    );
  }
);
