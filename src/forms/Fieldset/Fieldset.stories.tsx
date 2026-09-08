import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Checkbox } from '../Checkbox/Checkbox';
import { FormField, HelperText, Label } from '../FormField/FormField';
import { Input } from '../Input/Input';
import { Fieldset } from './Fieldset';

const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  argTypes: {
    gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: 'Billing address',
    description: 'Where we send invoices and receipts.',
  },
  render: (args) => (
    <Fieldset {...args} style={{ maxWidth: 360 }}>
      <FormField>
        <Label>Street</Label>
        <Input placeholder="1 Infinite Loop" fullWidth />
      </FormField>
      <FormField>
        <Label>City</Label>
        <Input placeholder="Cupertino" fullWidth />
      </FormField>
      <FormField>
        <Label>Postal code</Label>
        <Input placeholder="95014" fullWidth />
        <HelperText>Used for tax calculation.</HelperText>
      </FormField>
    </Fieldset>
  ),
};

export const Composed: Story = {
  render: () => (
    <Fieldset.Root gap="sm" style={{ maxWidth: 360 }}>
      <Fieldset.Legend>Email me about</Fieldset.Legend>
      <Fieldset.Description>You can change these any time.</Fieldset.Description>
      <Checkbox name="alerts" label="Product alerts" defaultChecked />
      <Checkbox name="digest" label="Weekly digest" />
      <Checkbox name="tips" label="Tips and tutorials" />
    </Fieldset.Root>
  ),
};

export const Gaps: Story = {
  render: () => (
    <Stack spacing={8}>
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <Fieldset key={gap} legend={`gap="${gap}"`} gap={gap} style={{ maxWidth: 360 }}>
          <Input placeholder="First" fullWidth />
          <Input placeholder="Second" fullWidth />
        </Fieldset>
      ))}
    </Stack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Fieldset legend="Archived project" description="Read-only." disabled style={{ maxWidth: 360 }}>
      <FormField>
        <Label>Name</Label>
        <Input defaultValue="Apollo" fullWidth />
      </FormField>
      <Checkbox name="public" label="Public" defaultChecked />
    </Fieldset>
  ),
};
