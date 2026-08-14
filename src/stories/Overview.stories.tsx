import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container, Divider, Flex, Grid, Stack, Typography } from '../primitives';
import { PlusIcon } from '../icons';
import { Button } from '../actions/Button/Button';
import { Select } from '../forms/Select/Select';
import { Switch } from '../forms/Switch/Switch';
import { TextField } from '../forms/TextField/TextField';
import { Tabs } from '../navigation/Tabs/Tabs';
import { Alert } from '../feedback/Alert/Alert';
import { Card } from '../data-display/Card/Card';
import { Table } from '../data-display/Table/Table';
import { SearchToolbar } from '../patterns/SearchToolbar/SearchToolbar';
import { DetailHeader } from '../patterns/DetailHeader/DetailHeader';

const meta = {
  title: 'Overview/Members Page',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const members = [
  { name: 'Aisha Patel', email: 'aisha@company.com', role: 'Owner', active: true },
  { name: 'Marcus Chen', email: 'marcus@company.com', role: 'Admin', active: true },
  { name: 'Sofia García', email: 'sofia@company.com', role: 'Member', active: false },
  { name: 'Tunde Okoye', email: 'tunde@company.com', role: 'Member', active: true },
];

function MembersPageDemo() {
  const [query, setQuery] = React.useState('');
  const visible = members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
  return (
      <Container maxWidth="lg" style={{ paddingBlock: 'var(--zest-space-8)' }}>
        <Stack spacing={6}>
          <DetailHeader
            title="Team members"
            subtitle="Manage who has access to this workspace"
            actions={
              <>
                <Button variant="outlined" color="neutral">
                  Export
                </Button>
                <Button startIcon={<PlusIcon />}>Invite member</Button>
              </>
            }
          />
          <Alert severity="info" onClose={() => {}}>
            Your plan includes 20 seats — 12 in use.
          </Alert>
          <Tabs.Root defaultValue="members">
            <Tabs.List>
              <Tabs.Tab value="members">Members</Tabs.Tab>
              <Tabs.Tab value="invites">Pending invites</Tabs.Tab>
              <Tabs.Tab value="roles">Roles</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="members">
              <Stack spacing={4}>
                <SearchToolbar
                  placeholder="Search members…"
                  value={query}
                  onValueChange={setQuery}
                  filters={
                    <Select
                      aria-label="Role filter"
                      size="sm"
                      placeholder="All roles"
                      options={[
                        { value: 'owner', label: 'Owner' },
                        { value: 'admin', label: 'Admin' },
                        { value: 'member', label: 'Member' },
                      ]}
                    />
                  }
                />
                <Card variant="outlined">
                  <Table.Root>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell>Active</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {visible.map((member) => (
                        <Table.Row key={member.email} hover>
                          <Table.Cell>{member.name}</Table.Cell>
                          <Table.Cell>{member.email}</Table.Cell>
                          <Table.Cell>{member.role}</Table.Cell>
                          <Table.Cell>
                            <Switch
                              aria-label={`${member.name} active`}
                              defaultChecked={member.active}
                              size="sm"
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card>
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="invites">
              <Typography color="secondary">No pending invites.</Typography>
            </Tabs.Panel>
            <Tabs.Panel value="roles">
              <Grid minChildWidth="260px" gap={4}>
                <Card>
                  <Card.Header title="Default role" subtitle="Applied to new members" />
                  <Card.Content>
                    <Select
                      aria-label="Default role"
                      defaultValue="member"
                      fullWidth
                      options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'member', label: 'Member' },
                      ]}
                    />
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Header title="Invite domain" subtitle="Restrict sign-ups" />
                  <Card.Content>
                    <TextField label="Allowed domain" defaultValue="company.com" fullWidth />
                  </Card.Content>
                </Card>
              </Grid>
            </Tabs.Panel>
          </Tabs.Root>
          <Divider />
          <Flex justify="between" align="center">
            <Typography variant="caption">Zest UI — Sigma-inspired design system</Typography>
            <Typography variant="caption">v0.1.0</Typography>
          </Flex>
        </Stack>
      </Container>
  );
}

export const MembersPage: Story = {
  render: () => <MembersPageDemo />,
};
