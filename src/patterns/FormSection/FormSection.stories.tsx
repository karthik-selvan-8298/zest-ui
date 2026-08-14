import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, Stack } from '../../primitives';
import { Switch } from '../../forms/Switch/Switch';
import { TextField } from '../../forms/TextField/TextField';
import { FormSection } from './FormSection';

const meta = {
  title: 'Patterns/FormSection',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsPage: Story = {
  render: () => (
    <Stack spacing={8} divider={<Divider />}>
      <FormSection title="Profile" description="How you appear across the workspace.">
        <TextField label="Display name" defaultValue="Karthik" fullWidth />
        <TextField label="Job title" placeholder="e.g. Product Engineer" fullWidth />
      </FormSection>
      <FormSection title="Notifications" description="Choose what we email you about.">
        <Switch label="Product updates" defaultChecked />
        <Switch label="Security alerts" defaultChecked />
        <Switch label="Marketing" />
      </FormSection>
    </Stack>
  ),
};
