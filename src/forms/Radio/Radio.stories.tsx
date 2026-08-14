import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Forms/Radio',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      <Radio value="compact" label="Compact" />
      <Radio value="comfortable" label="Comfortable" />
      <Radio value="spacious" label="Spacious (disabled)" disabled />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack spacing={4}>
      <RadioGroup defaultValue="a" orientation="horizontal" aria-label="Options">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" color="success" />
      </RadioGroup>
    </Stack>
  ),
};
