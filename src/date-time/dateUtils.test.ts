import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  clampDate,
  daysInMonth,
  endOfMonth,
  formatMonthYear,
  getWeekDays,
  isBetween,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from './dateUtils';

describe('startOfDay', () => {
  it('drops the time of day', () => {
    const result = startOfDay(new Date(2026, 7, 14, 13, 45, 30, 250));
    expect(result.getTime()).toBe(new Date(2026, 7, 14).getTime());
  });

  it('does not mutate the input', () => {
    const input = new Date(2026, 7, 14, 13, 45);
    startOfDay(input);
    expect(input.getHours()).toBe(13);
  });
});

describe('startOfMonth / endOfMonth / daysInMonth', () => {
  it('returns the first day of the month at midnight', () => {
    const result = startOfMonth(new Date(2026, 7, 14, 9, 30));
    expect(result.getTime()).toBe(new Date(2026, 7, 1).getTime());
  });

  it('returns the last day of the month', () => {
    expect(endOfMonth(new Date(2026, 7, 14)).getDate()).toBe(31);
    expect(endOfMonth(new Date(2026, 8, 1)).getDate()).toBe(30);
  });

  it('handles February and leap years', () => {
    expect(daysInMonth(new Date(2026, 1, 10))).toBe(28);
    expect(daysInMonth(new Date(2028, 1, 10))).toBe(29);
  });
});

describe('addDays', () => {
  it('adds days within a month', () => {
    expect(isSameDay(addDays(new Date(2026, 7, 14), 3), new Date(2026, 7, 17))).toBe(true);
  });

  it('crosses month and year boundaries', () => {
    expect(isSameDay(addDays(new Date(2026, 7, 31), 1), new Date(2026, 8, 1))).toBe(true);
    expect(isSameDay(addDays(new Date(2026, 11, 31), 1), new Date(2027, 0, 1))).toBe(true);
  });

  it('subtracts with negative amounts', () => {
    expect(isSameDay(addDays(new Date(2026, 8, 1), -1), new Date(2026, 7, 31))).toBe(true);
  });

  it('preserves the time of day', () => {
    const result = addDays(new Date(2026, 7, 14, 10, 20, 30, 40), 1);
    expect(result.getHours()).toBe(10);
    expect(result.getMinutes()).toBe(20);
    expect(result.getSeconds()).toBe(30);
    expect(result.getMilliseconds()).toBe(40);
  });
});

describe('addMonths', () => {
  it('adds months keeping the day when it fits', () => {
    const result = addMonths(new Date(2026, 7, 14), 2);
    expect(isSameDay(result, new Date(2026, 9, 14))).toBe(true);
  });

  it('clamps the day when the target month is shorter', () => {
    expect(isSameDay(addMonths(new Date(2026, 0, 31), 1), new Date(2026, 1, 28))).toBe(true);
    expect(isSameDay(addMonths(new Date(2028, 0, 31), 1), new Date(2028, 1, 29))).toBe(true);
    expect(isSameDay(addMonths(new Date(2026, 6, 31), 2), new Date(2026, 8, 30))).toBe(true);
  });

  it('crosses year boundaries in both directions', () => {
    expect(isSameDay(addMonths(new Date(2026, 11, 15), 1), new Date(2027, 0, 15))).toBe(true);
    expect(isSameDay(addMonths(new Date(2026, 0, 15), -1), new Date(2025, 11, 15))).toBe(true);
  });

  it('preserves the time of day', () => {
    const result = addMonths(new Date(2026, 7, 14, 23, 59), 1);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
  });
});

describe('isSameDay', () => {
  it('is true for the same day regardless of time', () => {
    expect(isSameDay(new Date(2026, 7, 14, 0, 1), new Date(2026, 7, 14, 23, 59))).toBe(true);
  });

  it('is false for different days, months, and years', () => {
    expect(isSameDay(new Date(2026, 7, 14), new Date(2026, 7, 15))).toBe(false);
    expect(isSameDay(new Date(2026, 7, 14), new Date(2026, 6, 14))).toBe(false);
    expect(isSameDay(new Date(2026, 7, 14), new Date(2025, 7, 14))).toBe(false);
  });

  it('is false when either side is null or undefined', () => {
    expect(isSameDay(null, new Date())).toBe(false);
    expect(isSameDay(new Date(), null)).toBe(false);
    expect(isSameDay(null, null)).toBe(false);
    expect(isSameDay(undefined, new Date())).toBe(false);
  });
});

describe('isSameMonth', () => {
  it('is true within a month, false across months and years', () => {
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2026, 7, 31))).toBe(true);
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2026, 8, 1))).toBe(false);
    expect(isSameMonth(new Date(2026, 7, 1), new Date(2025, 7, 1))).toBe(false);
  });

  it('is false when either side is null', () => {
    expect(isSameMonth(null, new Date())).toBe(false);
    expect(isSameMonth(new Date(), null)).toBe(false);
  });
});

describe('isBetween', () => {
  const start = new Date(2026, 7, 10);
  const end = new Date(2026, 7, 20);

  it('is true strictly inside the span', () => {
    expect(isBetween(new Date(2026, 7, 15), start, end)).toBe(true);
  });

  it('is inclusive of both endpoints', () => {
    expect(isBetween(new Date(2026, 7, 10), start, end)).toBe(true);
    expect(isBetween(new Date(2026, 7, 20), start, end)).toBe(true);
  });

  it('is false outside the span', () => {
    expect(isBetween(new Date(2026, 7, 9), start, end)).toBe(false);
    expect(isBetween(new Date(2026, 7, 21), start, end)).toBe(false);
  });

  it('accepts endpoints in reverse order', () => {
    expect(isBetween(new Date(2026, 7, 15), end, start)).toBe(true);
  });

  it('compares at day granularity, ignoring time of day', () => {
    expect(isBetween(new Date(2026, 7, 10, 0, 0, 1), new Date(2026, 7, 10, 23, 0), end)).toBe(
      true
    );
  });
});

describe('clampDate', () => {
  const min = new Date(2026, 7, 10);
  const max = new Date(2026, 7, 20);

  it('returns the date when within bounds', () => {
    const date = new Date(2026, 7, 15);
    expect(clampDate(date, min, max)).toBe(date);
  });

  it('clamps below min and above max', () => {
    expect(clampDate(new Date(2026, 7, 1), min, max).getTime()).toBe(min.getTime());
    expect(clampDate(new Date(2026, 7, 25), min, max).getTime()).toBe(max.getTime());
  });

  it('works with only one bound or none', () => {
    expect(clampDate(new Date(2026, 7, 1), min).getTime()).toBe(min.getTime());
    expect(clampDate(new Date(2026, 7, 25), undefined, max).getTime()).toBe(max.getTime());
    const date = new Date(2026, 7, 25);
    expect(clampDate(date)).toBe(date);
  });

  it('never mutates and returns copies of the bounds', () => {
    const clamped = clampDate(new Date(2026, 7, 1), min, max);
    expect(clamped).not.toBe(min);
    expect(clamped.getTime()).toBe(min.getTime());
  });
});

describe('getWeekDays', () => {
  it('returns 7 names starting with Sunday', () => {
    const days = getWeekDays('en-US');
    expect(days).toHaveLength(7);
    expect(days[0]).toBe('Sun');
    expect(days[6]).toBe('Sat');
  });

  it('localizes names', () => {
    const days = getWeekDays('de-DE');
    expect(days[0]).toBe('So');
    expect(days[1]).toBe('Mo');
  });
});

describe('formatMonthYear', () => {
  it('formats an English month heading', () => {
    expect(formatMonthYear(new Date(2026, 7, 14), 'en-US')).toBe('August 2026');
  });

  it('localizes the month name', () => {
    expect(formatMonthYear(new Date(2026, 7, 14), 'de-DE')).toBe('August 2026');
    expect(formatMonthYear(new Date(2026, 2, 14), 'fr-FR')).toBe('mars 2026');
  });
});
