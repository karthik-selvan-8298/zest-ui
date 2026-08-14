/**
 * Pure date helpers shared by the Date & Time components (Calendar,
 * DatePicker, DateRangePicker, TimePicker).
 *
 * All functions operate on local-time calendar days, never mutate their
 * inputs, and use only plain `Date` math plus `Intl` for localized names.
 */

/** Midnight (local time) of the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** First day of the given date's month, at local midnight. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Last day of the given date's month, at local midnight. */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** Number of days in the given date's month. */
export function daysInMonth(date: Date): number {
  return endOfMonth(date).getDate();
}

/** Add (or subtract) whole days, preserving the time of day. */
export function addDays(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

/**
 * Add (or subtract) whole months, clamping the day-of-month so the result
 * never overflows into the next month (Jan 31 + 1 month → Feb 28/29).
 * Preserves the time of day.
 */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const day = Math.min(date.getDate(), daysInMonth(target));
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    day,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

/** Whether two (possibly null) dates fall on the same calendar day. */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Whether two (possibly null) dates fall in the same month of the same year. */
export function isSameMonth(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/**
 * Whether `date` lies within the day-span of `start`…`end`, inclusive of
 * both endpoints. The endpoints may be given in either order.
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
  const time = startOfDay(date).getTime();
  const a = startOfDay(start).getTime();
  const b = startOfDay(end).getTime();
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return time >= min && time <= max;
}

/** Clamp a date between optional bounds (compared as instants). */
export function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date.getTime() < min.getTime()) return new Date(min.getTime());
  if (max && date.getTime() > max.getTime()) return new Date(max.getTime());
  return date;
}

/**
 * Localized short weekday names, Sunday-first (index 0 = Sunday), matching
 * the column order of the Calendar grid.
 */
export function getWeekDays(locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 2023-01-01 was a Sunday (local time).
  return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2023, 0, 1 + i)));
}

/** Localized "Month Year" heading, e.g. "August 2026". */
export function formatMonthYear(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}
