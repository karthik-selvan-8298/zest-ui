import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CalendarIcon,
  FilterIcon,
  InboxIcon,
  MenuIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from '../../icons';
import { Flex, Typography } from '../../primitives';
import { IconButton } from '../../actions/IconButton/IconButton';
import { IconTile } from '../../data-display/IconTile/IconTile';
import { Sidebar, type SidebarNavSection } from './Sidebar';

const meta = {
  title: 'Navigation/Sidebar',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* The nav is plain data — exactly what an API/config endpoint would return. */
const navData: SidebarNavSection[] = [
  {
    label: 'Marketing',
    items: [
      {
        key: 'landing',
        label: 'Landing',
        icon: <StarIcon />,
        caption: 'Display only admin role',
        badge: '+1',
        badgeColor: 'error',
      },
      { key: 'services', label: 'Services', icon: <FilterIcon /> },
      {
        key: 'blog',
        label: 'Blog',
        icon: <InboxIcon />,
        badge: '+2',
        badgeColor: 'info',
        defaultExpanded: true,
        items: [
          { key: 'item1', label: 'Item 1', caption: 'Display caption', badge: '+3' },
          { key: 'item2', label: 'Item 2', active: true },
        ],
      },
    ],
  },
  {
    label: 'Travel',
    items: [
      { key: 'about', label: 'About', icon: <UserIcon /> },
      { key: 'contact', label: 'Contact', icon: <CalendarIcon />, disabled: true },
      {
        key: 'level',
        label: 'Level',
        icon: <MenuIcon />,
        defaultExpanded: true,
        items: [
          {
            key: '2a',
            label: 'Level 2a',
            caption: 'This is the caption',
            items: [
              { key: '3a', label: 'Level 3a' },
              { key: '3b', label: 'Level 3b' },
            ],
          },
          { key: '2b', label: 'Level 2b' },
          { key: '2c', label: 'Level 2c' },
        ],
      },
    ],
  },
];

function SidebarHeader() {
  return (
    <Flex gap={2} align="center">
      <IconTile color="gradient" size="sm">
        <SettingsIcon />
      </IconTile>
      <div>
        <Typography variant="label">QA Toolkit</Typography>
        <Typography variant="caption" as="div">
          MCP · Webhook
        </Typography>
      </div>
    </Flex>
  );
}

export const DataDriven: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root
        header={<SidebarHeader />}
        logo={
          <IconTile color="gradient" size="sm">
            <SettingsIcon />
          </IconTile>
        }
        nav={navData}
        collapsible
      />
      <div style={{ padding: 24 }}>
        <Typography variant="heading-md">Content area</Typography>
        <Typography color="secondary" variant="body-sm">
          The nav is a plain data array (`nav` prop) — feed it straight from an API. The panel
          toggle in the header collapses it to a mini rail.
        </Typography>
      </div>
    </div>
  ),
};

export const Composition: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root
        header={<SidebarHeader />}
        logo={
          <IconTile color="gradient" size="sm">
            <SettingsIcon />
          </IconTile>
        }
        collapsible
      >
        <Sidebar.Section label="Overview">
          <Sidebar.Item icon={<InboxIcon />} label="MCP" defaultExpanded>
            <Sidebar.Item label="Connect" />
            <Sidebar.Item label="Tools" />
          </Sidebar.Item>
          <Sidebar.Item icon={<StarIcon />} label="Webhooks" />
        </Sidebar.Section>
        <Sidebar.Section label="Settings">
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" active defaultExpanded>
            <Sidebar.Item label="Personal" active />
            <Sidebar.Item label="Users" />
            <Sidebar.Item label="Credentials" />
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Root>
      <div style={{ padding: 24 }}>
        <Typography variant="heading-md">Content area</Typography>
      </div>
    </div>
  ),
};

function MobileDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ height: '100vh' }}>
      <Flex gap={2} align="center" style={{ padding: 16 }}>
        <IconButton aria-label="Open navigation" onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="label">Resize below 900px — the sidebar slides in</Typography>
      </Flex>
      <Sidebar.Root
        header={<SidebarHeader />}
        nav={navData}
        mobileOpen={open}
        onMobileClose={() => setOpen(false)}
      />
    </div>
  );
}

export const Mobile: Story = {
  render: () => <MobileDemo />,
};
