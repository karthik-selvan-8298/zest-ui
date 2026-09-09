import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives';
import { ChevronDownIcon } from '../../icons';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outlined" color="neutral">
        Day
      </Button>
      <Button variant="outlined" color="neutral">
        Week
      </Button>
      <Button variant="outlined" color="neutral">
        Month
      </Button>
    </ButtonGroup>
  ),
};

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Save</Button>
      <IconButton aria-label="More save options" variant="solid" color="primary">
        <ChevronDownIcon />
      </IconButton>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack spacing={4} style={{ maxWidth: 200 }}>
      <ButtonGroup orientation="vertical" fullWidth>
        <Button variant="outlined" color="neutral">
          Top
        </Button>
        <Button variant="outlined" color="neutral">
          Middle
        </Button>
        <Button variant="outlined" color="neutral">
          Bottom
        </Button>
      </ButtonGroup>
    </Stack>
  ),
};
