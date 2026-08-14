import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Stack, Typography, Flex, Paper } from '../primitives';
import * as colors from './primitives/colors';

const meta = {
  title: 'Foundation/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const scales = {
  primary: colors.primary,
  secondary: colors.secondary,
  info: colors.info,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
} as const;

export const Colors: Story = {
  render: () => (
    <Stack spacing={6}>
      {Object.entries(scales).map(([name, scale]) => (
        <Stack key={name} spacing={2}>
          <Typography variant="heading-sm" style={{ textTransform: 'capitalize' }}>
            {name}
          </Typography>
          <Flex gap={2} wrap>
            {Object.entries(scale).map(([stop, value]) => (
              <Stack key={stop} spacing={1} align="center">
                <div
                  style={{
                    width: 72,
                    height: 48,
                    borderRadius: 'var(--zest-radius-md)',
                    background: value,
                    boxShadow: 'inset 0 0 0 1px var(--zest-color-border-subtle)',
                  }}
                />
                <Typography variant="caption">{stop}</Typography>
              </Stack>
            ))}
          </Flex>
        </Stack>
      ))}
      <Stack spacing={2}>
        <Typography variant="heading-sm">Gray</Typography>
        <Flex gap={2} wrap>
          {Object.entries(colors.gray).map(([stop, value]) => (
            <Stack key={stop} spacing={1} align="center">
              <div
                style={{
                  width: 56,
                  height: 48,
                  borderRadius: 'var(--zest-radius-md)',
                  background: value,
                  boxShadow: 'inset 0 0 0 1px var(--zest-color-border-subtle)',
                }}
              />
              <Typography variant="caption">{stop}</Typography>
            </Stack>
          ))}
        </Flex>
      </Stack>
    </Stack>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Grid minChildWidth="180px" gap={4}>
      {(['sm', 'md', 'lg', 'xl', 'card', 'dropdown', 'dialog'] as const).map((name) => (
        <Paper
          key={name}
          radius="lg"
          style={{
            height: 96,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `var(--zest-shadow-${name})`,
          }}
        >
          <Typography variant="label">{name}</Typography>
        </Paper>
      ))}
    </Grid>
  ),
};

export const Radii: Story = {
  render: () => (
    <Flex gap={4} wrap>
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((name) => (
        <Stack key={name} spacing={1} align="center">
          <div
            style={{
              width: 80,
              height: 56,
              background: 'color-mix(in srgb, var(--zest-color-primary) 16%, transparent)',
              border: '2px solid var(--zest-color-primary)',
              borderRadius: `var(--zest-radius-${name})`,
            }}
          />
          <Typography variant="caption">{name}</Typography>
        </Stack>
      ))}
    </Flex>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Stack spacing={2}>
      {([1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const).map((step) => (
        <Flex key={step} gap={3} align="center">
          <Typography variant="caption" style={{ width: 80 }}>
            space-{step}
          </Typography>
          <div
            style={{
              width: `var(--zest-space-${step})`,
              height: 16,
              background: 'var(--zest-color-primary)',
              borderRadius: 2,
            }}
          />
        </Flex>
      ))}
    </Stack>
  ),
};
