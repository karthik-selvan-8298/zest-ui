import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Switch } from './Switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <Stack spacing={3}>
      <Switch label="Notifications" defaultChecked />
      <Switch label="Marketing emails" />
      <Switch label="Small switch" size="sm" defaultChecked color="success" />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </Stack>
  ),
};
