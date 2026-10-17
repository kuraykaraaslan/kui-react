import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';
import type { Column, DataTableRowAction } from './types';

type Row = { id: string; name: string; status: string };

const ROWS: Row[] = [
  { id: '1', name: 'Acme', status: 'active' },
  { id: '2', name: 'Globex', status: 'archived' },
];
const COLUMNS: Column<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
];

function actionsButton(name: string) {
  return within(screen.getByText(name).closest('tr')!).queryByRole('button', { name: /actions/i });
}

describe('DataTable rowActions', () => {
  it('without rowActions the table has no actions column (unchanged)', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} mode="static" searchable={false} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(actionsButton('Acme')).toBeNull();
  });

  it('adds a trailing column with a menu per row; actions get the row', async () => {
    const user = userEvent.setup();
    const onCall = vi.fn();
    const onRowClick = vi.fn();
    const actions: DataTableRowAction<Row>[] = [
      { id: 'call', label: 'Call', onClick: onCall },
      { id: 'delete', label: 'Delete', destructive: true, group: 'danger', order: 100 },
    ];
    render(<DataTable columns={COLUMNS} rows={ROWS} mode="static" searchable={false} rowActions={actions} onRowClick={onRowClick} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getByText('Actions')).toHaveClass('sr-only');

    await user.click(actionsButton('Acme')!);
    const items = screen.getAllByRole('menuitem');
    expect(items.map((i) => i.textContent)).toEqual(['Call', 'Delete']);
    expect(items[1].className).toContain('text-error');
    await user.click(screen.getByRole('menuitem', { name: 'Call' }));
    expect(onCall).toHaveBeenCalledWith(ROWS[0]);
    // Using the menu does not count as a click on the row.
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('resolves hidden, disabled, disabledReason and href per row', async () => {
    const user = userEvent.setup();
    const actions: DataTableRowAction<Row>[] = [
      { id: 'open', label: 'Open', href: (row) => `/companies/${row.id}` },
      { id: 'archive', label: 'Archive', hidden: (row) => row.status === 'archived' },
      {
        id: 'sign',
        label: 'Send for signature',
        disabled: (row) => row.status !== 'active',
        disabledReason: (row) => (row.status !== 'active' ? 'Only active companies' : undefined),
      },
    ];
    render(<DataTable columns={COLUMNS} rows={ROWS} mode="static" searchable={false} rowActions={actions} />);

    await user.click(actionsButton('Globex')!);
    expect(screen.queryByRole('menuitem', { name: 'Archive' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveAttribute('href', '/companies/2');
    const sign = screen.getByRole('menuitem', { name: 'Send for signature' });
    expect(sign).toBeDisabled();
    expect(sign).toHaveAccessibleDescription('Only active companies');
  });

  it('a row whose actions are all hidden gets an empty cell', () => {
    render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        mode="static"
        searchable={false}
        rowActions={[{ id: 'restore', label: 'Restore', hidden: (row) => row.status !== 'archived' }]}
      />,
    );
    expect(actionsButton('Acme')).toBeNull();
    expect(actionsButton('Globex')).not.toBeNull();
  });

  it('rowActionsLabel names each row for screen readers', () => {
    render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        mode="static"
        searchable={false}
        rowActions={[{ id: 'call', label: 'Call' }]}
        rowActionsLabel={(row) => `Actions for ${row.name}`}
      />,
    );
    expect(screen.getByRole('button', { name: 'Actions for Globex' })).toBeInTheDocument();
  });

  it('the empty state spans the actions column too', () => {
    render(<DataTable columns={COLUMNS} rows={[]} mode="static" searchable={false} rowActions={[{ id: 'call', label: 'Call' }]} />);
    expect(screen.getByText('No results found.').closest('td')).toHaveAttribute('colspan', '3');
  });

  it('works in server mode', async () => {
    const fetchPage = vi.fn(async () => ({ rows: ROWS, total: 2 }));
    render(<DataTable<Row> columns={COLUMNS} mode="server" fetchPage={fetchPage} rowActions={[{ id: 'call', label: 'Call' }]} />);
    await waitFor(() => expect(screen.getByText('Acme')).toBeInTheDocument());
    expect(actionsButton('Acme')).not.toBeNull();
  });
});
