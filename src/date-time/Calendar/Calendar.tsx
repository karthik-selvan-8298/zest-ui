import * as React from 'react';
import { IconButton } from '../../actions/IconButton/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import {
  addDays,
  addMonths,
  clampDate,
  endOfMonth,
  formatMonthYear,
  getWeekDays,
  isBetween,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from '../dateUtils';
import '../../base.css';
import './Calendar.css';

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Selected day (controlled). */
  value?: Date | null;
  /** Initially selected day (uncontrolled). */
  defaultValue?: Date | null;
  /** Fired when a day is picked. */
  onValueChange?: (value: Date | null) => void;
  /** Displayed month (controlled) — only year/month are read. */
  month?: Date;
  /** Initially displayed month (uncontrolled). */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Days before this are disabled. */
  minDate?: Date;
  /** Days after this are disabled. */
  maxDate?: Date;
  /** Predicate disabling arbitrary days (holidays, weekends…). */
  disabledDates?: (date: Date) => boolean;
  /** BCP 47 locale for month/weekday names. Defaults to the browser locale. */
  locale?: string;
  /** Render the leading/trailing days of adjacent months. Defaults to true. */
  showOutsideDays?: boolean;
  /**
   * Range mode (used by DateRangePicker). When either prop is passed the
   * calendar highlights `rangeStart`/`rangeEnd` as endpoints instead of
   * `value`; clicks still arrive through `onValueChange`.
   */
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  /** Hovered candidate for the range end — days in between get a soft tint. */
  rangeHover?: Date | null;
  /** Fired when the pointer enters an enabled day (null when leaving the grid). */
  onDayHover?: (date: Date | null) => void;
}

const WEEK_LENGTH = 7;
const GRID_ROWS = 6;

function toISODay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Month-grid calendar. Fully keyboard operable: arrows move the focused day,
 * PageUp/PageDown change month, Enter/Space select (roving tabindex).
 *
 * ```tsx
 * <Calendar defaultValue={new Date()} minDate={new Date()} />
 * ```
 */
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    value,
    defaultValue,
    onValueChange,
    month,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    disabledDates,
    locale,
    showOutsideDays = true,
    rangeStart,
    rangeEnd,
    rangeHover,
    onDayHover,
    className,
    ...rest
  },
  ref
) {
  const isRangeMode = rangeStart !== undefined || rangeEnd !== undefined;
  const start = rangeStart ?? null;
  const end = rangeEnd ?? null;

  const [selected, setSelected] = useControllableState<Date | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });

  const [visibleMonth, setVisibleMonth] = useControllableState<Date>({
    value: month ? startOfMonth(month) : undefined,
    defaultValue: startOfMonth(
      defaultMonth ?? value ?? defaultValue ?? rangeStart ?? new Date()
    ),
    onChange: onMonthChange,
  });

  const today = startOfDay(new Date());

  // Roving focus. `focusedDate` follows keyboard navigation; when the visible
  // month changes underneath it (header buttons), the tab target falls back
  // to the selected day, today, or the 1st of the month.
  const [focusedDate, setFocusedDate] = React.useState<Date>(
    () => (isRangeMode ? start : selected) ?? today
  );
  const pendingFocus = React.useRef(false);
  const gridRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-iso="${toISODay(focusedDate)}"]`)
      ?.focus();
  });

  const anchor = isRangeMode ? start : selected;
  const focusTarget = isSameMonth(focusedDate, visibleMonth)
    ? focusedDate
    : anchor && isSameMonth(anchor, visibleMonth)
      ? anchor
      : isSameMonth(today, visibleMonth)
        ? today
        : startOfMonth(visibleMonth);

  const weekDays = React.useMemo(() => getWeekDays(locale), [locale]);
  const dayFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [locale]
  );

  const isDayDisabled = (date: Date): boolean => {
    if (minDate && startOfDay(date).getTime() < startOfDay(minDate).getTime()) return true;
    if (maxDate && startOfDay(date).getTime() > startOfDay(maxDate).getTime()) return true;
    return disabledDates ? disabledDates(date) : false;
  };

  const moveFocus = (next: Date) => {
    const bounded = clampDate(
      next,
      minDate ? startOfDay(minDate) : undefined,
      maxDate ? startOfDay(maxDate) : undefined
    );
    pendingFocus.current = true;
    setFocusedDate(bounded);
    if (!isSameMonth(bounded, visibleMonth)) setVisibleMonth(startOfMonth(bounded));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(focusTarget, -1);
        break;
      case 'ArrowRight':
        next = addDays(focusTarget, 1);
        break;
      case 'ArrowUp':
        next = addDays(focusTarget, -WEEK_LENGTH);
        break;
      case 'ArrowDown':
        next = addDays(focusTarget, WEEK_LENGTH);
        break;
      case 'PageUp':
        next = addMonths(focusTarget, -1);
        break;
      case 'PageDown':
        next = addMonths(focusTarget, 1);
        break;
      default:
        return; // Enter/Space activate the focused button natively.
    }
    event.preventDefault();
    moveFocus(next);
  };

  const handleDayClick = (date: Date, disabled: boolean) => {
    if (disabled) return;
    setSelected(date);
    setFocusedDate(date);
    if (!isSameMonth(date, visibleMonth)) setVisibleMonth(startOfMonth(date));
  };

  const prevDisabled =
    minDate !== undefined &&
    endOfMonth(addMonths(visibleMonth, -1)).getTime() < startOfDay(minDate).getTime();
  const nextDisabled =
    maxDate !== undefined &&
    startOfMonth(addMonths(visibleMonth, 1)).getTime() > startOfDay(maxDate).getTime();

  // In range mode the tinted preview runs from the start to the committed
  // end, or — while the user is still choosing — to the hovered day.
  const previewEnd = end ?? rangeHover ?? null;

  const gridStart = addDays(startOfMonth(visibleMonth), -startOfMonth(visibleMonth).getDay());
  const rows = Array.from({ length: GRID_ROWS }, (_, rowIndex) =>
    Array.from({ length: WEEK_LENGTH }, (_, colIndex) =>
      addDays(gridStart, rowIndex * WEEK_LENGTH + colIndex)
    )
  );

  return (
    <div ref={ref} className={cx('zest-calendar', className)} {...rest}>
      <div className="zest-calendar__header">
        <IconButton
          size="sm"
          aria-label="Previous month"
          disabled={prevDisabled}
          onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
        >
          <ChevronLeftIcon />
        </IconButton>
        <span className="zest-calendar__label" aria-live="polite">
          {formatMonthYear(visibleMonth, locale)}
        </span>
        <IconButton
          size="sm"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label={rest['aria-label'] ?? formatMonthYear(visibleMonth, locale)}
        className="zest-calendar__grid"
        onKeyDown={handleKeyDown}
        onMouseLeave={onDayHover ? () => onDayHover(null) : undefined}
      >
        <div role="row" className="zest-calendar__row zest-calendar__weekdays">
          {weekDays.map((weekday, index) => (
            <span key={index} role="columnheader" className="zest-calendar__weekday">
              {weekday}
            </span>
          ))}
        </div>
        {rows.map((week, rowIndex) => (
          <div key={rowIndex} role="row" className="zest-calendar__row">
            {week.map((day) => {
              const iso = toISODay(day);
              const outside = !isSameMonth(day, visibleMonth);
              if (outside && !showOutsideDays) {
                return (
                  <span key={iso} className="zest-calendar__day" data-hidden="" aria-hidden />
                );
              }
              const disabled = isDayDisabled(day);
              const isSelected = isRangeMode
                ? isSameDay(day, start) || isSameDay(day, end)
                : isSameDay(day, selected);
              const inRange =
                isRangeMode &&
                start !== null &&
                previewEnd !== null &&
                isBetween(day, start, previewEnd) &&
                !isSameDay(day, start) &&
                !isSameDay(day, previewEnd);
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  className={cx('zest-calendar__day', 'zest-focusable')}
                  data-iso={iso}
                  data-outside={outside ? '' : undefined}
                  data-today={isSameDay(day, today) ? '' : undefined}
                  data-selected={isSelected ? '' : undefined}
                  data-in-range={inRange ? '' : undefined}
                  data-disabled={disabled ? '' : undefined}
                  aria-disabled={disabled || undefined}
                  aria-selected={isSelected}
                  aria-label={dayFormatter.format(day)}
                  tabIndex={isSameDay(day, focusTarget) ? 0 : -1}
                  onClick={() => handleDayClick(day, disabled)}
                  onMouseEnter={
                    onDayHover && !disabled ? () => onDayHover(day) : undefined
                  }
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
