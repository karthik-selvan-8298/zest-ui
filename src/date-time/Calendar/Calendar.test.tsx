import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';
import { isSameDay } from '../dateUtils';

const AUG_14 = new Date(2026, 7, 14);

function dayName(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

describe('Calendar', () => {
  it('renders the month heading, weekday headers, and a 6-week grid', () => {
    render(<Calendar defaultValue={AUG_14} locale="en-US" />);
    expect(screen.getByText('August 2026')).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent('Sun');
    // 6 rows x 7 columns of day cells (outside days shown by default).
    expect(screen.getAllByRole('gridcell')).toHaveLength(42);
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
  });

  it('marks the selected day and dims outside days', () => {
    render(<Calendar defaultValue={AUG_14} locale="en-US" />);
    const selected = screen.getByRole('gridcell', { name: dayName(AUG_14) });
    expect(selected).toHaveAttribute('aria-selected', 'true');
    expect(selected).toHaveAttribute('data-selected');
    // August 2026 starts on a Saturday — July 26 is an outside day.
    const outside = screen.getByRole('gridcell', { name: dayName(new Date(2026, 6, 26)) });
    expect(outside).toHaveAttribute('data-outside');
  });

  it('selects a day on click and fires onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Calendar defaultMonth={AUG_14} locale="en-US" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 20)) }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(isSameDay(onValueChange.mock.calls[0]?.[0], new Date(2026, 7, 20))).toBe(true);
    expect(
      screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 20)) })
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('respects minDate: earlier days are disabled and not selectable', async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={AUG_14}
        minDate={new Date(2026, 7, 10)}
        locale="en-US"
        onValueChange={onValueChange}
      />
    );
    const before = screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 5)) });
    expect(before).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(before);
    expect(onValueChange).not.toHaveBeenCalled();
    // The previous-month header button is disabled too — all of July is out of range.
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    // Days at/after the bound remain clickable.
    await userEvent.click(screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 10)) }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('respects the disabledDates predicate', async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={AUG_14}
        locale="en-US"
        disabledDates={(date) => date.getDay() === 0}
        onValueChange={onValueChange}
      />
    );
    const sunday = screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 16)) });
    expect(sunday).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(sunday);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('moves focus with arrow keys (roving tabindex)', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={AUG_14} locale="en-US" />);
    const selected = screen.getByRole('gridcell', { name: dayName(AUG_14) });
    expect(selected).toHaveAttribute('tabindex', '0');
    selected.focus();

    await user.keyboard('{ArrowRight}');
    const aug15 = screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 15)) });
    expect(aug15).toHaveFocus();
    expect(aug15).toHaveAttribute('tabindex', '0');
    expect(selected).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 22)) })).toHaveFocus();

    await user.keyboard('{ArrowLeft}{ArrowUp}');
    expect(screen.getByRole('gridcell', { name: dayName(AUG_14) })).toHaveFocus();
  });

  it('crosses month boundaries with arrows and PageDown', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={new Date(2026, 7, 31)} locale="en-US" />);
    screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 31)) }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('September 2026')).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: dayName(new Date(2026, 8, 1)) })).toHaveFocus();

    await user.keyboard('{PageDown}');
    expect(screen.getByText('October 2026')).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: dayName(new Date(2026, 9, 1)) })).toHaveFocus();

    await user.keyboard('{PageUp}{PageUp}');
    expect(screen.getByText('August 2026')).toBeInTheDocument();
  });

  it('selects the focused day with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar defaultValue={AUG_14} locale="en-US" onValueChange={onValueChange} />);
    screen.getByRole('gridcell', { name: dayName(AUG_14) }).focus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(isSameDay(onValueChange.mock.calls[0]?.[0], new Date(2026, 7, 15))).toBe(true);
  });

  it('navigates months from the header and hides outside days when asked', async () => {
    render(<Calendar defaultMonth={AUG_14} locale="en-US" showOutsideDays={false} />);
    // 31 August days; the 11 outside cells are hidden placeholders.
    expect(screen.getAllByRole('gridcell')).toHaveLength(31);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('September 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('July 2026')).toBeInTheDocument();
  });

  it('supports controlled value', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Calendar value={AUG_14} month={AUG_14} locale="en-US" onValueChange={onValueChange} />
    );
    await userEvent.click(screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 1)) }));
    // Controlled: the selection does not move until the owner re-renders.
    expect(
      screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 1)) })
    ).toHaveAttribute('aria-selected', 'false');
    rerender(
      <Calendar
        value={new Date(2026, 7, 1)}
        month={AUG_14}
        locale="en-US"
        onValueChange={onValueChange}
      />
    );
    expect(
      screen.getByRole('gridcell', { name: dayName(new Date(2026, 7, 1)) })
    ).toHaveAttribute('aria-selected', 'true');
  });
});
