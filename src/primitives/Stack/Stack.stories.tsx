import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../Divider/Divider';
import { Paper } from '../Paper/Paper';
import { Typography } from '../Typography/Typography';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ children }: { children?: React.ReactNode }) {
  return (
    <Paper
      bordered
      radius="md"
      style={{
        padding: 'var(--zest-space-3)',
        background: 'color-mix(in srgb, var(--zest-color-primary) 8%, transparent)',
      }}
    >
      <Typography variant="body-sm">{children}</Typography>
    </Paper>
  );
}

export const Basic: Story = {
  render: () => (
    <Stack spacing={2} style={{ maxWidth: 360 }}>
      <Demo>One</Demo>
      <Demo>Two</Demo>
      <Demo>Three</Demo>
    </Stack>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <Stack spacing={2} divider={<Divider variant="dashed" />} style={{ maxWidth: 360 }}>
      <Demo>One</Demo>
      <Demo>Two</Demo>
      <Demo>Three</Demo>
    </Stack>
  ),
};
