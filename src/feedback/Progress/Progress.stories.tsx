import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  args: { value: 40 },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Stack spacing={4}>
      {tones.map((color) => (
        <Progress key={color} value={60} color={color} label={color} />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={4}>
      <Progress value={40} size="sm" label="Small" />
      <Progress value={40} size="md" label="Medium" />
    </Stack>
  ),
};

export const WithLabelAndValue: Story = {
  args: { value: 72, label: 'Uploading photos…', showValue: true },
};

export const Indeterminate: Story = {
  args: { value: null, label: 'Preparing…' },
};
