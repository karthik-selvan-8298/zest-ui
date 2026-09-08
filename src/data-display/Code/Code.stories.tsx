import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Stack, Typography } from '../../primitives';
import { Code } from './Code';

const meta = {
  title: 'Data Display/Code',
  component: Code,
  args: { children: 'npm run build' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['soft', 'outlined'] },
    color: {
      control: 'select',
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    truncate: { control: 'boolean' },
    copyable: { control: 'boolean' },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const tones = ['neutral', 'primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

export const Variants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Flex gap={2} wrap>
        {tones.map((color) => (
          <Code key={color} color={color}>
            {color}
          </Code>
        ))}
      </Flex>
      <Flex gap={2} wrap>
        {tones.map((color) => (
          <Code key={color} color={color} variant="outlined">
            {color}
          </Code>
        ))}
      </Flex>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap={2} align="center">
      <Code size="sm">--force</Code>
      <Code size="md">--force</Code>
    </Flex>
  ),
};

export const InProse: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="body1">
        Set <Code>ZEST_API_KEY</Code> in your <Code color="primary">.env</Code> file, then run{' '}
        <Code>npm run dev</Code>. The chip scales with the text around it.
      </Typography>
      <Typography variant="body2" color="secondary">
        Requests hit{' '}
        <Code variant="outlined" color="info">
          GET /v1/users/:id
        </Code>{' '}
        and return <Code color="success">200 OK</Code> or <Code color="error">404 Not Found</Code>.
      </Typography>
    </Stack>
  ),
};

export const Copyable: Story = {
  render: () => (
    <Flex gap={2} align="center" wrap>
      <Code copyable>sk_live_••••••••••••••••4242</Code>
      <Code copyable color="primary" variant="outlined">
        usr_01J8K2M3N4P5Q6R7S8T9V0W1
      </Code>
    </Flex>
  ),
};

export const Truncate: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <Code truncate copyable>
        /workspaces/zest-ui/src/data-display/Code/Code.stories.tsx
      </Code>
    </div>
  ),
};
