import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { Autocomplete } from './Autocomplete';

const meta = {
  title: 'Forms/Autocomplete',
  component: Autocomplete,
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const components = [
  'Alert',
  'Avatar',
  'Badge',
  'Button',
  'Checkbox',
  'Chip',
  'Dialog',
  'Input',
  'Menu',
  'Pagination',
  'Select',
  'Switch',
  'Tabs',
  'Tooltip',
];

export const Default: Story = {
  args: {
    suggestions: components,
    placeholder: 'Search components…',
    'aria-label': 'Component',
  },
};

function ControlledDemo() {
  const [value, setValue] = React.useState('');
  return (
    <Stack spacing={2}>
      <Autocomplete
        aria-label="Component"
        suggestions={components}
        value={value}
        onValueChange={setValue}
        placeholder="Search components…"
      />
      <Typography variant="body-sm" color="secondary">
        Text: {value || '(empty)'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  args: { suggestions: components },
  render: () => <ControlledDemo />,
};

export const States: Story = {
  args: { suggestions: components },
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 280 }}>
      <Autocomplete
        aria-label="Small"
        suggestions={components}
        size="sm"
        placeholder="Small"
        fullWidth
      />
      <Autocomplete
        aria-label="Error"
        suggestions={components}
        error
        placeholder="Error state"
        fullWidth
      />
      <Autocomplete
        aria-label="Disabled"
        suggestions={components}
        disabled
        placeholder="Disabled"
        fullWidth
      />
    </Stack>
  ),
};
