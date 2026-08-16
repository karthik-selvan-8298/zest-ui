import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../Flex/Flex';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Divider } from './Divider';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Stack spacing={5} style={{ maxWidth: 420 }}>
      <Typography variant="body2">Solid</Typography>
      <Divider />
      <Typography variant="body2">Dashed</Typography>
      <Divider variant="dashed" />
      <Divider>With a label</Divider>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Flex gap={4} align="center" style={{ height: 40 }}>
      <Typography variant="body2">Left</Typography>
      <Divider orientation="vertical" />
      <Typography variant="body2">Right</Typography>
    </Flex>
  ),
};
