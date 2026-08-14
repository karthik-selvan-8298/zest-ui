import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Table } from './Table';

const meta = {
  title: 'Data Display/Table',
} satisfies Meta;

export default meta;
type Story = StoryObj;

const rows = [
  { name: 'Aisha Patel', role: 'Design lead', status: 'Active', seats: 4 },
  { name: 'Marcus Chen', role: 'Engineer', status: 'Active', seats: 2 },
  { name: 'Sofia García', role: 'PM', status: 'Invited', seats: 1 },
  { name: 'Tunde Okoye', role: 'Engineer', status: 'Suspended', seats: 0 },
];

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 640 }}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell align="right">Seats</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.name} hover>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell align="right">{row.seats}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  ),
};

export const DenseAndStriped: Story = {
  render: () => (
    <Table.Root dense striped>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.name}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};


export const StackedOnMobile: StoryObj = {
  render: () => (
    <Table.Root stackOnMobile>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
          <Table.HeaderCell hideOnMobile>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.name}>
            <Table.Cell label="Name">{row.name}</Table.Cell>
            <Table.Cell label="Role">{row.role}</Table.Cell>
            {/* Optional on mobile — visible on desktop only */}
            <Table.Cell label="Status" hideOnMobile>
              {row.status}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};
