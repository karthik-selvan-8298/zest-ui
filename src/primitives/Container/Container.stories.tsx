import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../Flex/Flex';
import { Divider } from '../Divider/Divider';
import { Paper } from '../Paper/Paper';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPaper: Story = {
  render: () => (
    <Container maxWidth="md">
      <Paper shadow="card" radius="xl" style={{ padding: 'var(--zest-inset-surface)' }}>
        <Stack spacing={2}>
          <Typography variant="h4">Paper in a md container</Typography>
          <Typography color="secondary">
            The Sigma card language: surface radius with the soft card shadow.
          </Typography>
          <Divider />
          <Flex center style={{ height: 64 }}>Centered content</Flex>
        </Stack>
      </Paper>
    </Container>
  ),
};
