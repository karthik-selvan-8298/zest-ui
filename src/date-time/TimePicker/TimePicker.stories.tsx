import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { TimePicker } from './TimePicker';

const meta = {
  title: 'Date & Time/TimePicker',
  component: TimePicker,
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Meeting time',
    placeholder: 'Meeting time',
  },
};

function ControlledDemo() {
  const [time, setTime] = React.useState<string | null>('09:30');
  return (
    <Stack spacing={2} style={{ maxWidth: 240 }}>
      <TimePicker aria-label="Start time" value={time} onValueChange={setTime} fullWidth />
      <Typography variant="body2" color="secondary">
        Value: {time ?? 'null'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const BusinessHours: Story = {
  name: 'Business hours (15 min steps)',
  args: {
    'aria-label': 'Appointment time',
    placeholder: 'Appointment',
    step: 15,
    minTime: '09:00',
    maxTime: '17:00',
    defaultValue: '10:15',
  },
};

export const HourFormats: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 240 }}>
      <TimePicker aria-label="12-hour" hour12 defaultValue="14:30" fullWidth />
      <TimePicker aria-label="24-hour" hour12={false} defaultValue="14:30" fullWidth />
      <TimePicker aria-label="German" locale="de-DE" defaultValue="14:30" fullWidth />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 240 }}>
      <TimePicker aria-label="Small" size="sm" placeholder="Small" fullWidth />
      <TimePicker aria-label="Error" error placeholder="Error state" fullWidth />
      <TimePicker aria-label="Disabled" disabled placeholder="Disabled" fullWidth />
    </Stack>
  ),
};
