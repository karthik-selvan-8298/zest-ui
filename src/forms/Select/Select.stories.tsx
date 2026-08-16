import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { Select } from './Select';

const meta = {
  title: 'Forms/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest', label: 'Guest', disabled: true },
];

export const Default: Story = {
  args: {
    options: roles,
    placeholder: 'Choose a role',
    'aria-label': 'Role',
  },
};

function ControlledDemo() {
  const [value, setValue] = React.useState<string | null>('editor');
  return (
    <Stack spacing={2}>
      <Select aria-label="Role" options={roles} value={value} onValueChange={setValue} />
      <Typography variant="body2" color="secondary">
        Selected: {value ?? 'none'}
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  args: { options: roles },
  render: () => <ControlledDemo />,
};

export const States: Story = {
  args: { options: roles },
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 280 }}>
      <Select aria-label="Small" options={roles} size="sm" placeholder="Small" fullWidth />
      <Select aria-label="Error" options={roles} error placeholder="Error state" fullWidth />
      <Select aria-label="Disabled" options={roles} disabled placeholder="Disabled" fullWidth />
    </Stack>
  ),
};
