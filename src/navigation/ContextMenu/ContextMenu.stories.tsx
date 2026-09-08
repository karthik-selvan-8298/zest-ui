import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyIcon, EditIcon, TrashIcon } from '../../icons';
import { ContextMenu } from './ContextMenu';

const meta = {
  title: 'Navigation/ContextMenu',
  component: ContextMenu.Root,
} satisfies Meta<typeof ContextMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/* A dashed target area so the right-click surface is obvious in the canvas. */
function Target({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 360,
        height: 180,
        border: '1px dashed var(--zest-color-border-strong)',
        borderRadius: 'var(--zest-radius-surface)',
        color: 'var(--zest-color-text-secondary)',
        fontFamily: 'var(--zest-font-family-sans)',
        fontSize: 'var(--zest-font-size-sm)',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Target>Right-click (or long-press) here</Target>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>
          <EditIcon /> Rename
        </ContextMenu.Item>
        <ContextMenu.Item>
          <CopyIcon /> Duplicate
        </ContextMenu.Item>
        <ContextMenu.Item disabled>Move to…</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item destructive>
          <TrashIcon /> Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};

export const GroupsAndSubmenu: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Target>Right-click for grouped actions</Target>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>File</ContextMenu.GroupLabel>
          <ContextMenu.Item>Open</ContextMenu.Item>
          <ContextMenu.Item>Download</ContextMenu.Item>
          <ContextMenu.SubmenuRoot>
            <ContextMenu.SubmenuTrigger>Share</ContextMenu.SubmenuTrigger>
            <ContextMenu.Content>
              <ContextMenu.Item>Copy link</ContextMenu.Item>
              <ContextMenu.Item>Email</ContextMenu.Item>
              <ContextMenu.Item>Invite people…</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.SubmenuRoot>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Organize</ContextMenu.GroupLabel>
          <ContextMenu.Item>Add to favorites</ContextMenu.Item>
          <ContextMenu.Item>Move to folder…</ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Item destructive>
          <TrashIcon /> Move to trash
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};

export const CheckboxAndRadioItems: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Target>Right-click for view options</Target>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Show</ContextMenu.GroupLabel>
          <ContextMenu.CheckboxItem defaultChecked>Hidden files</ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem>File extensions</ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem disabled>Path bar</ContextMenu.CheckboxItem>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Sort by</ContextMenu.GroupLabel>
          <ContextMenu.RadioGroup defaultValue="name">
            <ContextMenu.RadioItem value="name">Name</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="modified">Date modified</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="size">Size</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};
