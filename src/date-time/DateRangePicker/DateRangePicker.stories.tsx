import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { DateRangePicker, type DateRange } from './DateRangePicker';

const meta = {
  title: 'Date & Time/DateRangePicker',
  component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Trip dates',
    'aria-label': 'Trip dates',
  },
};

export const WithDefaultRange: Story = {
  args: {
    'aria-label': 'Report period',
    defaultValue: { start: new Date(2026, 0, 5), end: new Date(2026, 0, 12) },
    clearable: true,
  },
};

function ControlledDemo() {
  const [range, setRange] = React.useState<DateRange>({
    start: new Date(2026, 7, 3),
    end: new Date(2026, 7, 21),
  });
  return (
    <Stack spacing={2} style={{ maxWidth: 320 }}>
      <DateRangePicker
        aria-label="Sprint dates"
        value={range}
        onValueChange={setRange}
        clearable
        fullWidth
      />
      <Typography variant="body-sm" color="secondary">
        Start: {range.start ? range.start.toDateString() : 'null'} — End:{' '}
        {range.end ? range.end.toDateString() : 'null'}
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
    'aria-label': 'Booking range',
    placeholder: 'Booking range',
    minDate: new Date(2026, 7, 1),
    maxDate: new Date(2026, 9, 31),
  },
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <DateRangePicker aria-label="Small" size="sm" placeholder="Small" fullWidth />
      <DateRangePicker aria-label="Error" error placeholder="Error state" fullWidth />
      <DateRangePicker aria-label="Disabled" disabled placeholder="Disabled" fullWidth />
    </Stack>
  ),
};
