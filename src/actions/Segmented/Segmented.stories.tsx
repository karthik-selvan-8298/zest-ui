import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarIcon, ClockIcon, MenuIcon, StarIcon } from '../../icons';
import { Stack, Typography } from '../../primitives';
import { Segmented } from './Segmented';

const viewOptions = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'calendar', label: 'Calendar' },
];

const meta = {
  title: 'Actions/Segmented',
  component: Segmented,
  args: {
    'aria-label': 'View',
    options: viewOptions,
    defaultValue: 'list',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Soft: Story = {
  args: { variant: 'soft' },
};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: (args) => (
    <Stack spacing={3}>
      {tones.map((color) => (
        <Stack key={color} direction="row" spacing={3} align="center">
          <Segmented {...args} color={color} />
          <Segmented {...args} color={color} variant="soft" />
        </Stack>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" spacing={3} align="center">
      <Segmented {...args} size="sm" />
      <Segmented {...args} size="md" />
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stack spacing={3}>
      <Segmented
        aria-label="Period"
        defaultValue="day"
        options={[
          { value: 'day', label: 'Day', icon: <ClockIcon /> },
          { value: 'week', label: 'Week', icon: <CalendarIcon /> },
          { value: 'starred', label: 'Starred', icon: <StarIcon /> },
        ]}
      />
      {/* Icon-only segments need an aria-label each. */}
      <Segmented aria-label="Layout" defaultValue="list" variant="soft">
        <Segmented.Item value="list" aria-label="List" icon={<MenuIcon />} />
        <Segmented.Item value="calendar" aria-label="Calendar" icon={<CalendarIcon />} />
        <Segmented.Item value="starred" aria-label="Starred" icon={<StarIcon />} />
      </Segmented>
    </Stack>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ width: 420 }}>
      <Segmented {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Stack spacing={3}>
      <Segmented {...args} disabled />
      <Segmented
        aria-label="Plan"
        defaultValue="free"
        options={[
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise', disabled: true },
        ]}
      />
    </Stack>
  ),
};

function ControlledDemo() {
  const [period, setPeriod] = React.useState('week');
  return (
    <Stack spacing={2} align="start">
      <Segmented aria-label="Period" value={period} onValueChange={setPeriod}>
        <Segmented.Item value="day">Day</Segmented.Item>
        <Segmented.Item value="week">Week</Segmented.Item>
        <Segmented.Item value="month">Month</Segmented.Item>
      </Segmented>
      <Typography variant="body2" color="secondary">
        Showing the last <strong>{period}</strong>. Clicking the selected segment keeps it selected.
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
