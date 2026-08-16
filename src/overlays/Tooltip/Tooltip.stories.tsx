import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../primitives';
import { TrashIcon } from '../../icons';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sides: Story = {
  args: {
    title: 'Tooltip',
    children: (
      <Button variant="outlined" color="neutral">
        Hover me
      </Button>
    ),
  },
  render: () => (
    <Flex gap={4} align="center">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip key={side} title={`Tooltip on ${side}`} side={side}>
          <Button variant="outlined" color="neutral">
            {side}
          </Button>
        </Tooltip>
      ))}
      <Tooltip title="Delete forever">
        <IconButton aria-label="Delete">
          <TrashIcon />
        </IconButton>
      </Tooltip>
    </Flex>
  ),
};
