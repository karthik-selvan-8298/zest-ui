import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrashIcon } from '../../icons';
import { Button } from '../../actions/Button';
import { Stack, Typography } from '../../primitives';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Utilities/VisuallyHidden',
  component: VisuallyHidden,
  args: { children: 'Only screen readers hear this' },
  argTypes: {
    focusable: { control: 'boolean' },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack spacing={2}>
      <Typography variant="body2" color="secondary">
        Nothing is painted below this line, but assistive tech announces the hidden text.
      </Typography>
      <VisuallyHidden {...args} />
    </Stack>
  ),
};

export const IconButtonLabel: Story = {
  render: () => (
    <Button variant="soft" color="error">
      <TrashIcon />
      <VisuallyHidden>Delete draft</VisuallyHidden>
    </Button>
  ),
};

export const SkipLink: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="body2" color="secondary">
        Press Tab: the skip link appears fixed in the top-left corner while focused.
      </Typography>
      <VisuallyHidden as="a" href="#main-content" focusable>
        Skip to main content
      </VisuallyHidden>
      <Typography id="main-content" variant="body1">
        Main content
      </Typography>
    </Stack>
  ),
};
