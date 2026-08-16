import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Input } from '../Input/Input';
import { FieldError, FormField, HelperText, Label } from './FormField';

const meta = {
  title: 'Forms/FormField',
  component: FormField,
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <FormField>
        <Label required>Workspace name</Label>
        <Input placeholder="acme-inc" fullWidth />
        <HelperText>Lowercase letters and dashes only.</HelperText>
      </FormField>
    </Stack>
  ),
};

export const WithError: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 320 }}>
      <FormField invalid>
        <Label>Email</Label>
        <Input defaultValue="not-an-email" fullWidth />
        <FieldError match>Enter a valid email address.</FieldError>
      </FormField>
    </Stack>
  ),
};
