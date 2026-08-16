import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { Calendar } from './Calendar';

const meta = {
  title: 'Date & Time/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: new Date(2026, 7, 14),
    'aria-label': 'Choose a date',
  },
};

function ControlledDemo() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 7, 14));
  return (
    <Stack spacing={2}>
      <Calendar value={date} onValueChange={setDate} aria-label="Delivery date" />
      <Typography variant="body2" color="secondary">
        Selected: {date ? date.toDateString() : 'none'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const MinMax: Story = {
  name: 'Min / max dates',
  args: {
    defaultMonth: new Date(2026, 7, 1),
    minDate: new Date(2026, 7, 5),
    maxDate: new Date(2026, 8, 20),
    'aria-label': 'Booking date',
  },
};

export const DisabledWeekends: Story = {
  args: {
    defaultMonth: new Date(2026, 7, 1),
    disabledDates: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    'aria-label': 'Meeting date',
  },
};

export const Localized: Story = {
  render: () => (
    <Stack direction="row" spacing={6}>
      <Calendar defaultValue={new Date(2026, 7, 14)} locale="de-DE" aria-label="Datum" />
      <Calendar defaultValue={new Date(2026, 7, 14)} locale="fr-FR" aria-label="Date" />
    </Stack>
  ),
};

export const WithoutOutsideDays: Story = {
  args: {
    defaultMonth: new Date(2026, 7, 1),
    showOutsideDays: false,
    'aria-label': 'Choose a date',
  },
};
