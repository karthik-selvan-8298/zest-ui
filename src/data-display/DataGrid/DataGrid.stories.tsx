import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataGrid, type DataGridColumn } from './DataGrid';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  age: number;
}

const firstNames = [
  'Aisha',
  'Marcus',
  'Sofia',
  'Tunde',
  'Priya',
  'Diego',
  'Yuki',
  'Lena',
  'Omar',
  'Chloe',
  'Ravi',
  'Ingrid',
  'Mateo',
  'Nadia',
  'Felix',
  'Amara',
  'Jonas',
  'Keiko',
  'Luca',
  'Zara',
  'Ethan',
  'Maya',
  'Oscar',
  'Tara',
  'Vikram',
];
const roles = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Support'];
const departments = ['Platform', 'Growth', 'Finance', 'Operations'];

function pick<T>(list: T[], index: number): T {
  return list[index % list.length] as T;
}

const employees: Employee[] = firstNames.map((name, index) => ({
  id: `emp-${index + 1}`,
  name,
  role: pick(roles, index),
  department: pick(departments, index),
  age: 24 + ((index * 7) % 30),
}));

const columns: DataGridColumn<Employee>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'department', header: 'Department', sortable: true },
  { key: 'age', header: 'Age', sortable: true, align: 'right', width: 96 },
];

const meta = {
  title: 'Data Display/DataGrid',
  component: DataGrid,
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DataGrid
      columns={columns}
      rows={employees}
      getRowId={(row) => row.id}
      selectable
      pageSize={10}
      defaultSort={{ key: 'name', direction: 'asc' }}
    />
  ),
};

export const DenseStriped: Story = {
  render: () => (
    <DataGrid columns={columns} rows={employees.slice(0, 8)} getRowId={(row) => row.id} dense striped />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataGrid columns={columns} rows={[]} getRowId={(row: Employee) => row.id} selectable loading />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataGrid columns={columns} rows={[]} getRowId={(row: Employee) => row.id} selectable />
  ),
};


/* Dynamic: columns derived from the data itself + simulated API loading. */
function DynamicDemo() {
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRows([
        { name: 'Aisha Patel', email: 'aisha@company.com', role: 'Owner', seats: 4 },
        { name: 'Marcus Chen', email: 'marcus@company.com', role: 'Admin', seats: 2 },
        { name: 'Sofia García', email: 'sofia@company.com', role: 'Member', seats: 1 },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <DataGrid
      rows={rows}
      loading={loading}
      stackOnMobile
      getRowId={(row) => String(row.email)}
    />
  );
}

export const DynamicFromApi: StoryObj = {
  render: () => <DynamicDemo />,
};
