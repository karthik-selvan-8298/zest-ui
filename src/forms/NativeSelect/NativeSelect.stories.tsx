import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Stack } from '../../primitives';
import { NativeSelect } from './NativeSelect';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
];

const meta = {
  title: 'Forms/NativeSelect',
  component: NativeSelect,
  args: { options: fruits, 'aria-label': 'Fruit' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Choose a fruit…' },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <NativeSelect size="sm" options={fruits} aria-label="Small" />
      <NativeSelect size="md" options={fruits} aria-label="Medium" />
    </Flex>
  ),
};

export const States: Story = {
  render: () => (
    <Stack spacing={3}>
      <NativeSelect options={fruits} error placeholder="With error" aria-label="With error" />
      <NativeSelect options={fruits} disabled defaultValue="apple" aria-label="Disabled" />
      <NativeSelect options={fruits} fullWidth placeholder="Full width" aria-label="Full width" />
    </Stack>
  ),
};
