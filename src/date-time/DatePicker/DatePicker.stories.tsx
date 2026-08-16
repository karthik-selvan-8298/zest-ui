import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Date & Time/DatePicker',
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Due date',
    'aria-label': 'Due date',
  },
};

function ControlledDemo() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 7, 14));
  return (
    <Stack spacing={2} style={{ maxWidth: 280 }}>
      <DatePicker
        aria-label="Invoice date"
        value={date}
        onValueChange={setDate}
        clearable
        fullWidth
      />
      <Typography variant="body2" color="secondary">
        Value: {date ? date.toDateString() : 'null'}
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
    placeholder: 'Delivery window',
    'aria-label': 'Delivery date',
    minDate: new Date(2026, 7, 10),
    maxDate: new Date(2026, 8, 30),
    defaultValue: new Date(2026, 7, 14),
  },
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 280 }}>
      <DatePicker aria-label="Small" size="sm" placeholder="Small" fullWidth />
      <DatePicker
        aria-label="Clearable"
        defaultValue={new Date(2026, 7, 14)}
        clearable
        fullWidth
      />
      <DatePicker aria-label="Error" error placeholder="Error state" fullWidth />
      <DatePicker aria-label="Disabled" disabled placeholder="Disabled" fullWidth />
      <DatePicker
        aria-label="Weekdays only"
        placeholder="Weekdays only"
        disabledDates={(date) => date.getDay() === 0 || date.getDay() === 6}
        fullWidth
      />
    </Stack>
  ),
};
