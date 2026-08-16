import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from '../Paper/Paper';
import { Typography } from '../Typography/Typography';
import { Flex } from './Flex';

const meta = {
  title: 'Layout/Flex',
  component: Flex,
} satisfies Meta<typeof Flex>;

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

export const Row: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Demo>Left</Demo>
      <div style={{ flex: 1 }} />
      <Demo>Right</Demo>
    </Flex>
  ),
};

export const Centered: Story = {
  render: () => (
    <Flex
      center
      style={{
        height: 120,
        border: '1px dashed var(--zest-color-border)',
        borderRadius: 'var(--zest-radius-surface)',
      }}
    >
      <Demo>Perfectly centered</Demo>
    </Flex>
  ),
};

export const Wrapping: Story = {
  render: () => (
    <Flex gap={2} wrap style={{ maxWidth: 360 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <Demo key={i}>Item {i + 1}</Demo>
      ))}
    </Flex>
  ),
};
