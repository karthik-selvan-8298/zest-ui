import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from '../../icons';
import { Button } from '../../actions/Button/Button';
import { Select } from '../../forms/Select/Select';
import { SearchToolbar } from './SearchToolbar';

const meta = {
  title: 'Patterns/SearchToolbar',
  component: SearchToolbar,
} satisfies Meta<typeof SearchToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SearchToolbar
      placeholder="Search projects…"
      filters={
        <Select
          aria-label="Status"
          size="sm"
          placeholder="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
      }
      actions={<Button startIcon={<PlusIcon />}>New project</Button>}
    />
  ),
};
