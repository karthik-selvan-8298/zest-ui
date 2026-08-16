import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Typography } from '../../primitives';
import { Kbd } from './Kbd';

const meta = {
  title: 'Utilities/Kbd',
  component: Kbd,
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <Typography variant="body2">Open the palette with</Typography>
      <Kbd>Ctrl+K</Kbd>
      <Kbd>⏎</Kbd>
    </Flex>
  ),
};
