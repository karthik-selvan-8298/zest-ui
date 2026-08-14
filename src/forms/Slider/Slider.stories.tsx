import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Slider } from './Slider';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  args: { defaultValue: 30 },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

export const Colors: Story = {
  render: () => (
    <Stack spacing={4} style={{ width: 320 }}>
      {tones.map((color) => (
        <Slider key={color} color={color} defaultValue={50} aria-label={color} />
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack spacing={4} style={{ width: 320 }}>
      <Slider size="sm" defaultValue={40} aria-label="Small" />
      <Slider size="md" defaultValue={40} aria-label="Medium" />
    </Stack>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Stack spacing={4} style={{ width: 320 }}>
      <Slider defaultValue={30} showValue aria-label="Volume" />
      <Slider defaultValue={750} min={0} max={1000} step={50} showValue aria-label="Budget" />
    </Stack>
  ),
};

export const Range: Story = {
  render: () => (
    <Stack spacing={4} style={{ width: 320 }}>
      <Slider defaultValue={[20, 80]} aria-label="Price range" />
      <Slider defaultValue={[20, 80]} showValue aria-label="Price range with value" />
    </Stack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack spacing={4} style={{ width: 320 }}>
      <Slider defaultValue={40} disabled aria-label="Disabled" />
      <Slider defaultValue={[20, 60]} disabled aria-label="Disabled range" />
    </Stack>
  ),
};
