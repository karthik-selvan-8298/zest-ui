import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Typography } from '../../primitives';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Forms/SearchInput',
  component: SearchInput,
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search components…', 'aria-label': 'Search' },
};

function ControlledDemo() {
  const [value, setValue] = React.useState('side');
  return (
    <Stack spacing={2} style={{ maxWidth: 320 }}>
      <SearchInput aria-label="Search" value={value} onValueChange={setValue} fullWidth />
      <Typography variant="body-sm" color="secondary">
        Query: “{value}” — the clear button resets it.
      </Typography>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
