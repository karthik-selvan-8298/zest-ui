import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import {
  CopyIcon,
  DownloadIcon,
  EditIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from '../../icons';
import { Command } from './Command';
import type { CommandItem } from './Command';

const meta = {
  title: 'Navigation/Command',
  component: Command,
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: CommandItem[] = [
  {
    id: 'new-file',
    label: 'New file',
    group: 'Actions',
    icon: <PlusIcon />,
    shortcut: '⌘+N',
    keywords: ['create', 'add'],
    onSelect: () => console.log('New file'),
  },
  {
    id: 'rename',
    label: 'Rename…',
    group: 'Actions',
    icon: <EditIcon />,
    keywords: ['edit'],
    onSelect: () => console.log('Rename'),
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    group: 'Actions',
    icon: <CopyIcon />,
    shortcut: '⌘+D',
    keywords: ['copy', 'clone'],
    onSelect: () => console.log('Duplicate'),
  },
  {
    id: 'download',
    label: 'Download',
    group: 'Actions',
    icon: <DownloadIcon />,
    keywords: ['export', 'save'],
    onSelect: () => console.log('Download'),
  },
  {
    id: 'delete',
    label: 'Delete',
    group: 'Actions',
    icon: <TrashIcon />,
    shortcut: '⌘+⌫',
    keywords: ['remove', 'trash'],
    onSelect: () => console.log('Delete'),
  },
  {
    id: 'profile',
    label: 'View profile',
    group: 'Account',
    icon: <UserIcon />,
    keywords: ['user', 'me'],
    onSelect: () => console.log('Profile'),
  },
  {
    id: 'settings',
    label: 'Open settings',
    group: 'Account',
    icon: <SettingsIcon />,
    shortcut: '⌘+,',
    keywords: ['preferences', 'config'],
    onSelect: () => console.log('Settings'),
  },
  {
    id: 'theme',
    label: 'Toggle dark mode',
    group: 'Account',
    icon: <MoonIcon />,
    keywords: ['appearance', 'light', 'dark'],
    onSelect: () => console.log('Theme'),
  },
];

function PaletteDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command palette</Button>
      <Command open={open} onOpenChange={setOpen} items={items} />
    </>
  );
}

export const Default: Story = {
  args: { open: false, onOpenChange: () => {}, items },
  render: () => <PaletteDemo />,
};
