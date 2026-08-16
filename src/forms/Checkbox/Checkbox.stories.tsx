import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Stack, Typography } from '../../primitives';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <Flex gap={4} align="center" wrap>
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </Flex>
  ),
};

export const Colors: Story = {
  render: () => (
    <Flex gap={4}>
      {(['primary', 'secondary', 'success', 'error'] as const).map((color) => (
        <Checkbox key={color} color={color} label={color} defaultChecked />
      ))}
    </Flex>
  ),
};

export const Group: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="subtitle2">Email me about</Typography>
      <CheckboxGroup defaultValue={['alerts']}>
        <Checkbox name="alerts" label="Product alerts" />
        <Checkbox name="digest" label="Weekly digest" />
        <Checkbox name="tips" label="Tips and tricks" />
      </CheckboxGroup>
    </Stack>
  ),
};
