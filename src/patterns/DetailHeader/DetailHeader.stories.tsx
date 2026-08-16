import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { DetailHeader } from './DetailHeader';

const meta = {
  title: 'Patterns/DetailHeader',
  component: DetailHeader,
} satisfies Meta<typeof DetailHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Payments service',
    subtitle: 'Last deployed 2 hours ago · production',
    actions: (
      <>
        <Button variant="outlined" color="neutral">
          View logs
        </Button>
        <Button>Deploy</Button>
      </>
    ),
  },
};
