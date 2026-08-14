import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button/Button';
import { DetailHeader } from './DetailHeader';

const meta = {
  title: 'Patterns/DetailHeader',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DetailHeader
      title="Payments service"
      subtitle="Last deployed 2 hours ago · production"
      actions={
        <>
          <Button variant="outlined" color="neutral">
            View logs
          </Button>
          <Button>Deploy</Button>
        </>
      }
    />
  ),
};
