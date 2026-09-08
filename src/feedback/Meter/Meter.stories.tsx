import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Meter } from './Meter';

const meta = {
  title: 'Feedback/Meter',
  component: Meter,
  args: { value: 40, label: 'Storage used' },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
    segments: { control: { type: 'number', min: 0, max: 10 } },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Stack spacing={4}>
      {tones.map((color) => (
        <Meter key={color} value={60} color={color} label={color} />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={4}>
      <Meter value={40} size="sm" label="Small" />
      <Meter value={40} size="md" label="Medium" />
    </Stack>
  ),
};

export const WithValue: Story = {
  args: { value: 72, label: 'Storage used', showValue: true },
};

export const Thresholds: Story = {
  render: () => (
    <Stack spacing={4}>
      <Meter value={60} label="60% — fine" showValue thresholds={{ warning: 80, error: 95 }} />
      <Meter value={85} label="85% — warning" showValue thresholds={{ warning: 80, error: 95 }} />
      <Meter value={97} label="97% — error" showValue thresholds={{ warning: 80, error: 95 }} />
    </Stack>
  ),
};

export const Segmented: Story = {
  render: () => (
    <Stack spacing={4}>
      <Meter value={25} segments={4} color="error" label="Weak" />
      <Meter value={50} segments={4} color="warning" label="Fair" />
      <Meter value={75} segments={4} color="info" label="Good" />
      <Meter value={100} segments={4} color="success" label="Strong" />
    </Stack>
  ),
};

export const CustomRange: Story = {
  args: {
    value: 6.5,
    min: 0,
    max: 10,
    label: 'Rating',
    showValue: true,
    format: { style: 'decimal', maximumFractionDigits: 1 },
  },
};
