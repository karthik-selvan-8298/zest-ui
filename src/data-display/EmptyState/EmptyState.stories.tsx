import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchIcon, PlusIcon } from '../../icons';
import { Button } from '../../actions/Button/Button';
import { Flex } from '../../primitives';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Data Display/EmptyState',
  component: EmptyState,
  args: { title: 'No projects yet' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No projects yet',
    description: 'Create your first project to get started.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    action: <Button startIcon={<PlusIcon />}>New project</Button>,
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results found',
    description: 'Try a different search term or clear the filters.',
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={6} align="center">
      <EmptyState size="md" title="Nothing here" description="Medium — for page sections." />
      <EmptyState size="sm" title="Nothing here" description="Small — for compact panels." />
    </Flex>
  ),
};

export const States: Story = {
  render: () => (
    <Flex gap={6} align="start" wrap>
      <EmptyState
        state="empty"
        title="No projects yet"
        description="Create your first project to get started."
        action={<Button startIcon={<PlusIcon />}>New project</Button>}
      />
      <EmptyState state="loading" description="Fetching your projects." />
      <EmptyState
        state="error"
        title="Couldn't load projects"
        description="Something went wrong on our side. Please try again."
        action={
          <Button color="neutral" variant="outlined">
            Retry
          </Button>
        }
      />
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`state` covers the async lifecycle: `loading` shows a Spinner with `role="status"`, `error` shows the error icon with `role="alert"` and keeps the action for a Retry.',
      },
    },
  },
};
