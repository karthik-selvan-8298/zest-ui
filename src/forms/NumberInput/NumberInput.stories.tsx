import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Stack } from '../../primitives';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  args: { 'aria-label': 'Quantity', defaultValue: 1 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <NumberInput size="sm" defaultValue={1} aria-label="Small" />
      <NumberInput size="md" defaultValue={1} aria-label="Medium" />
    </Flex>
  ),
};

export const MinMaxStep: Story = {
  render: () => (
    <Stack spacing={3}>
      <NumberInput defaultValue={5} min={0} max={10} aria-label="Zero to ten" />
      <NumberInput defaultValue={50} min={0} max={100} step={10} aria-label="Steps of ten" />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack spacing={3}>
      <NumberInput defaultValue={3} error aria-label="With error" />
      <NumberInput defaultValue={3} disabled aria-label="Disabled" />
      <NumberInput placeholder="Amount" aria-label="Empty with placeholder" />
      <NumberInput defaultValue={3} fullWidth aria-label="Full width" />
    </Stack>
  ),
};
