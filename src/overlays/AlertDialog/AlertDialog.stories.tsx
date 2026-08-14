import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { AlertDialog, ConfirmDialog } from './AlertDialog';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog.Root,
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="danger">Delete project</Button>} />
      <AlertDialog.Content
        title="Delete project?"
        description="All tasks, files, and history will be permanently removed. This action cannot be undone."
      >
        <AlertDialog.Footer>
          <AlertDialog.Close render={<Button variant="ghost" color="neutral" />}>
            Cancel
          </AlertDialog.Close>
          <AlertDialog.Close render={<Button variant="danger" />}>Delete</AlertDialog.Close>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};

export const Confirm: Story = {
  render: () => (
    <ConfirmDialog
      trigger={<Button variant="outlined" color="neutral">Archive report</Button>}
      title="Archive this report?"
      description="You can restore it from the archive at any time."
      confirmLabel="Archive"
      onConfirm={() => {}}
    />
  ),
};

export const DestructiveConfirm: Story = {
  render: () => (
    <ConfirmDialog
      trigger={<Button variant="danger">Delete account</Button>}
      title="Delete your account?"
      description="This permanently removes your account and all associated data."
      confirmLabel="Delete"
      destructive
      onConfirm={() => {}}
    />
  ),
};

export const LoadingConfirm: Story = {
  render: function LoadingConfirmStory() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          if (!loading) setOpen(next);
        }}
        trigger={<Button variant="danger">Delete with delay</Button>}
        title="Delete 12 items?"
        description="The items will be removed from every workspace."
        confirmLabel="Delete"
        destructive
        loading={loading}
        onConfirm={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setOpen(false);
          }, 1500);
        }}
      />
    );
  },
};
