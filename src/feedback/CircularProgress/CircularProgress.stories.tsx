import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../primitives';
import { CircularProgress } from './CircularProgress';

const meta = {
  title: 'Feedback/CircularProgress',
  component: CircularProgress,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Indeterminate: Story = {};

export const Determinate: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <CircularProgress value={25} />
      <CircularProgress value={50} />
      <CircularProgress value={75} />
      <CircularProgress value={100} color="success" />
    </Flex>
  ),
};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Flex gap={4} align="center">
      {tones.map((color) => (
        <CircularProgress key={color} color={color} />
      ))}
    </Flex>
  ),
};

export const SizesAndThickness: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <CircularProgress size={24} thickness={3} />
      <CircularProgress size={40} />
      <CircularProgress size={64} thickness={5} value={64} />
    </Flex>
  ),
};
