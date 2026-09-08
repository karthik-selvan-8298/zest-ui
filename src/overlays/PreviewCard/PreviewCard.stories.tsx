import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../data-display/Avatar/Avatar';
import { Flex, Stack, Typography } from '../../primitives';
import { PreviewCard } from './PreviewCard';

const meta = {
  title: 'Overlays/PreviewCard',
  component: PreviewCard.Root,
} satisfies Meta<typeof PreviewCard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function UserCard() {
  return (
    <Flex gap={3} align="start">
      <Avatar name="Ada Lovelace" color="primary" />
      <Stack spacing={1}>
        <Typography variant="subtitle2">Ada Lovelace</Typography>
        <Typography variant="caption">@ada · Analytical Engines</Typography>
        <Typography variant="body2">
          Mathematician and writer. First to recognise that a machine could do more than arithmetic.
        </Typography>
      </Stack>
    </Flex>
  );
}

export const Default: Story = {
  render: () => (
    <Typography variant="body1">
      Reviewed by{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#ada">@ada</PreviewCard.Trigger>
        <PreviewCard.Content>
          <UserCard />
        </PreviewCard.Content>
      </PreviewCard.Root>{' '}
      earlier today.
    </Typography>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Typography variant="body1">
      See the{' '}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#typography">typography guide</PreviewCard.Trigger>
        <PreviewCard.Content side="top" arrow>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Typography</Typography>
            <Typography variant="body2">
              The art and science of arranging type to make written language clear, visually
              appealing, and effective.
            </Typography>
          </Stack>
        </PreviewCard.Content>
      </PreviewCard.Root>{' '}
      for the full scale.
    </Typography>
  ),
};

export const Timing: Story = {
  render: () => (
    <Typography variant="body1">
      Fast card (100ms open, no close delay):{' '}
      <PreviewCard.Root delay={100} closeDelay={0}>
        <PreviewCard.Trigger href="#fast">hover me</PreviewCard.Trigger>
        <PreviewCard.Content side="right" align="start">
          <UserCard />
        </PreviewCard.Content>
      </PreviewCard.Root>
    </Typography>
  ),
};

export const Sides: Story = {
  render: () => (
    <Flex gap={6} wrap>
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <PreviewCard.Root key={side} delay={100}>
          <PreviewCard.Trigger href={`#${side}`}>{side}</PreviewCard.Trigger>
          <PreviewCard.Content side={side} arrow>
            <Typography variant="body2">Card on the {side}.</Typography>
          </PreviewCard.Content>
        </PreviewCard.Root>
      ))}
    </Flex>
  ),
};
