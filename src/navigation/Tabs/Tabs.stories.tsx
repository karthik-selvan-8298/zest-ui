import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../../primitives';
import { Tabs } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="general" style={{ maxWidth: 480 }}>
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="members">Members</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Tab value="danger" disabled>
          Danger zone
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general">
        <Typography color="secondary">Workspace name, logo, and defaults.</Typography>
      </Tabs.Panel>
      <Tabs.Panel value="members">
        <Typography color="secondary">Invite teammates and manage roles.</Typography>
      </Tabs.Panel>
      <Tabs.Panel value="billing">
        <Typography color="secondary">Plan, invoices, and payment method.</Typography>
      </Tabs.Panel>
      <Tabs.Panel value="danger">
        <Typography color="error">Delete workspace.</Typography>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Segmented: Story = {
  render: () => (
    <Tabs.Root defaultValue="wrapped">
      <Tabs.List variant="segmented">
        <Tabs.Tab value="wrapped">Wrapped</Tabs.Tab>
        <Tabs.Tab value="raw">Raw</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="wrapped">
        <Typography variant="body-sm" color="secondary">
          Wraps input as {'{ tool, input, caller }'} — the default envelope.
        </Typography>
      </Tabs.Panel>
      <Tabs.Panel value="raw">
        <Typography variant="body-sm" color="secondary">
          Sends the input exactly as provided.
        </Typography>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Tabs.Root defaultValue="week" style={{ maxWidth: 360 }}>
      <Tabs.List fullWidth>
        <Tabs.Tab value="day">Day</Tabs.Tab>
        <Tabs.Tab value="week">Week</Tabs.Tab>
        <Tabs.Tab value="month">Month</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="day">Day view</Tabs.Panel>
      <Tabs.Panel value="week">Week view</Tabs.Panel>
      <Tabs.Panel value="month">Month view</Tabs.Panel>
    </Tabs.Root>
  ),
};
