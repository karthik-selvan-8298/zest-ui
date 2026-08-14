import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../primitives';
import { TrashIcon } from '../../icons';
import { Button } from '../../actions/Button/Button';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Popover } from '../Popover/Popover';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Overlays/Tooltip & Popover',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Tooltips: Story = {
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

export const PopoverExample: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="soft">Open popover</Button>} />
      <Popover.Content style={{ maxWidth: 260 }}>
        <Popover.Title
          render={<h4 style={{ margin: 0, font: 'var(--zest-font-weight-bold) 14px/1.5 var(--zest-font-family-sans)' }} />}
        >
          Quick settings
        </Popover.Title>
        <p style={{ marginBottom: 0, color: 'var(--zest-color-text-secondary)' }}>
          Anchored, dismissible, and focus-managed by Base UI.
        </p>
      </Popover.Content>
    </Popover.Root>
  ),
};
