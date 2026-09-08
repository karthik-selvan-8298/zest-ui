import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { Menubar } from './Menubar';

const meta = {
  title: 'Navigation/Menubar',
  component: Menubar.Root,
  argTypes: {
    variant: { control: 'inline-radio', options: ['contained', 'plain'] },
  },
} satisfies Meta<typeof Menubar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function AppMenus() {
  return (
    <>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>New</Menubar.Item>
          <Menubar.Item>Open…</Menubar.Item>
          <Menubar.Item>Save</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Print…</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Undo</Menubar.Item>
          <Menubar.Item>Redo</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Cut</Menubar.Item>
          <Menubar.Item>Copy</Menubar.Item>
          <Menubar.Item>Paste</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Zoom in</Menubar.Item>
          <Menubar.Item>Zoom out</Menubar.Item>
          <Menubar.Item disabled>Actual size</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Help</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Documentation</Menubar.Item>
          <Menubar.Item>Keyboard shortcuts</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </>
  );
}

export const Default: Story = {
  args: { variant: 'contained' },
  render: (args) => (
    <Menubar.Root {...args}>
      <AppMenus />
    </Menubar.Root>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={4} align="start">
      <Menubar.Root variant="contained">
        <AppMenus />
      </Menubar.Root>
      <Menubar.Root variant="plain">
        <AppMenus />
      </Menubar.Root>
    </Stack>
  ),
};

export const GroupsSubmenusAndToggles: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Group>
            <Menubar.GroupLabel>Document</Menubar.GroupLabel>
            <Menubar.Item>New</Menubar.Item>
            <Menubar.Item>Open…</Menubar.Item>
          </Menubar.Group>
          <Menubar.Separator />
          <Menubar.SubmenuRoot>
            <Menubar.SubmenuTrigger>Export</Menubar.SubmenuTrigger>
            <Menubar.SubmenuContent>
              <Menubar.Item>PDF</Menubar.Item>
              <Menubar.Item>PNG</Menubar.Item>
              <Menubar.Item>SVG</Menubar.Item>
            </Menubar.SubmenuContent>
          </Menubar.SubmenuRoot>
          <Menubar.Separator />
          <Menubar.Item destructive>Delete project</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.CheckboxItem defaultChecked>Show sidebar</Menubar.CheckboxItem>
          <Menubar.CheckboxItem>Show status bar</Menubar.CheckboxItem>
          <Menubar.Separator />
          <Menubar.Group>
            <Menubar.GroupLabel>Theme</Menubar.GroupLabel>
            <Menubar.RadioGroup defaultValue="system">
              <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
              <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
              <Menubar.RadioItem value="system">System</Menubar.RadioItem>
            </Menubar.RadioGroup>
          </Menubar.Group>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  ),
};
