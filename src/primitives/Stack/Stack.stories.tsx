import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../Divider/Divider';
import { Flex } from '../Flex/Flex';
import { Paper } from '../Paper/Paper';
import { Spacer } from '../misc/Spacer';
import { Typography } from '../Typography/Typography';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack & Flex',
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

export const WithDivider: Story = {
  render: () => (
    <Stack spacing={2} divider={<Divider variant="dashed" />}>
      <Demo>One</Demo>
      <Demo>Two</Demo>
      <Demo>Three</Demo>
    </Stack>
  ),
};

export const FlexRow: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Demo>Left</Demo>
      <Spacer />
      <Demo>Right</Demo>
    </Flex>
  ),
};
