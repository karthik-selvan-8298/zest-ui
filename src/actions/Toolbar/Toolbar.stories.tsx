import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  FilterIcon,
  MenuIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
} from '../../icons';
import { Input } from '../../forms/Input';
import { Stack } from '../../primitives';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Toggle } from '../Toggle';
import { ToggleGroup } from '../ToggleGroup';
import { Toolbar } from './Toolbar';

const meta = {
  title: 'Actions/Toolbar',
  component: Toolbar.Root,
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['plain', 'contained'] },
  },
} satisfies Meta<typeof Toolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Built-in look: no `render` → ghost icon button. */
export const Default: Story = {
  args: { 'aria-label': 'Actions' },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button aria-label="Edit">
        <EditIcon />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Duplicate">
        <CopyIcon />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Star">
        <StarIcon />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Delete" disabled>
        <TrashIcon />
      </Toolbar.Button>
      <Toolbar.Button aria-label="More">
        <MoreHorizontalIcon />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
};

/* Zest controls through `render`: Toggle, IconButton, Button and Input. */
export const WithZestControls: Story = {
  args: { 'aria-label': 'Formatting', variant: 'contained' },
  render: (args) => (
    <Toolbar.Root {...args}>
      <ToggleGroup defaultValue={['left']} aria-label="Alignment">
        <Toolbar.Button
          render={
            <Toggle value="left" aria-label="Align left">
              <ArrowLeftIcon />
            </Toggle>
          }
        />
        <Toolbar.Button
          render={
            <Toggle value="center" aria-label="Align center">
              <MenuIcon />
            </Toggle>
          }
        />
        <Toolbar.Button
          render={
            <Toggle value="right" aria-label="Align right">
              <ArrowRightIcon />
            </Toggle>
          }
        />
      </ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.Button
          render={
            <IconButton aria-label="Filter">
              <FilterIcon />
            </IconButton>
          }
        />
        <Toolbar.Button
          render={
            <IconButton aria-label="Download">
              <DownloadIcon />
            </IconButton>
          }
        />
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Button
        render={
          <Button variant="ghost" color="neutral">
            Share
          </Button>
        }
      />
      <Toolbar.Button render={<Button variant="soft">Publish</Button>} />
      <Toolbar.Separator />
      <Toolbar.Input
        render={<Input size="sm" placeholder="Search" startIcon={<SearchIcon />} />}
        aria-label="Search"
      />
    </Toolbar.Root>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={4}>
      {(['plain', 'contained'] as const).map((variant) => (
        <Toolbar.Root key={variant} variant={variant} aria-label={`${variant} toolbar`}>
          <Toolbar.Button aria-label="Edit">
            <EditIcon />
          </Toolbar.Button>
          <Toolbar.Button aria-label="Duplicate">
            <CopyIcon />
          </Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Link href="#docs">Docs</Toolbar.Link>
          <Toolbar.Button aria-label="Delete">
            <TrashIcon />
          </Toolbar.Button>
        </Toolbar.Root>
      ))}
    </Stack>
  ),
};

export const Vertical: Story = {
  args: { 'aria-label': 'Tools', orientation: 'vertical', variant: 'contained' },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button aria-label="Edit">
        <EditIcon />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Duplicate">
        <CopyIcon />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button aria-label="Star">
        <StarIcon />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Delete">
        <TrashIcon />
      </Toolbar.Button>
    </Toolbar.Root>
  ),
};

export const Disabled: Story = {
  args: { 'aria-label': 'Actions', disabled: true, variant: 'contained' },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button aria-label="Edit">
        <EditIcon />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Duplicate">
        <CopyIcon />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button
        render={
          <Button variant="ghost" color="neutral">
            Share
          </Button>
        }
      />
    </Toolbar.Root>
  ),
};
