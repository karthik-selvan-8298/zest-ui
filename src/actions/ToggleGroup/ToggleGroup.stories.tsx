import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeftIcon, ArrowRightIcon, MenuIcon, SunIcon, MoonIcon, StarIcon } from '../../icons';
import { Stack } from '../../primitives';
import { Toggle } from '../Toggle';
import { ToggleGroup } from './ToggleGroup';

const meta = {
  title: 'Actions/ToggleGroup',
  component: ToggleGroup,
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleGroup defaultValue={['left']}>
      <Toggle value="left" aria-label="Align left">
        <ArrowLeftIcon />
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        <MenuIcon />
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        <ArrowRightIcon />
      </Toggle>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup toggleMultiple defaultValue={['sun', 'star']}>
      <Toggle value="sun" aria-label="Day">
        <SunIcon />
      </Toggle>
      <Toggle value="moon" aria-label="Night">
        <MoonIcon />
      </Toggle>
      <Toggle value="star" aria-label="Starred">
        <StarIcon />
      </Toggle>
    </ToggleGroup>
  ),
};

export const SizesAndStates: Story = {
  render: () => (
    <Stack spacing={3}>
      <ToggleGroup defaultValue={['a']}>
        <Toggle size="sm" value="a" aria-label="Option A">
          <SunIcon />
        </Toggle>
        <Toggle size="sm" value="b" aria-label="Option B">
          <MoonIcon />
        </Toggle>
      </ToggleGroup>
      <ToggleGroup defaultValue={['a']} disabled>
        <Toggle value="a" aria-label="Option A">
          <SunIcon />
        </Toggle>
        <Toggle value="b" aria-label="Option B">
          <MoonIcon />
        </Toggle>
      </ToggleGroup>
      <ToggleGroup defaultValue={['a']} orientation="vertical">
        <Toggle value="a" aria-label="Option A">
          <SunIcon />
        </Toggle>
        <Toggle value="b" aria-label="Option B">
          <MoonIcon />
        </Toggle>
      </ToggleGroup>
    </Stack>
  ),
};
