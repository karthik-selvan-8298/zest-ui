import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../primitives';
import { CircularProgress } from './CircularProgress';

const meta = {
  title: 'Feedback/CircularProgress',
  component: CircularProgress,
  // `aria-label` satisfies the required accessible name for every story.
  args: { 'aria-label': 'Loading' },
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
      <CircularProgress value={25} aria-label="25% complete" />
      <CircularProgress value={50} aria-label="50% complete" />
      <CircularProgress value={75} aria-label="75% complete" />
      <CircularProgress value={100} color="success" aria-label="Complete" />
    </Flex>
  ),
};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Flex gap={4} align="center">
      {tones.map((color) => (
        <CircularProgress key={color} color={color} aria-label={`Loading (${color})`} />
      ))}
    </Flex>
  ),
};

export const SizesAndThickness: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <CircularProgress size={24} thickness={3} aria-label="Loading" />
      <CircularProgress size={40} aria-label="Loading" />
      <CircularProgress size={64} thickness={5} value={64} label={<strong>Upload 64%</strong>} />
    </Flex>
  ),
};
