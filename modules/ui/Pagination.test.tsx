import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('marks the current page with aria-current="page"', () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute('aria-current');
  });

  it('renders all pages without ellipsis when the range is small', () => {
    render(<Pagination page={2} totalPages={4} onPageChange={() => {}} />);
    for (const n of [1, 2, 3, 4]) {
      expect(screen.getByRole('button', { name: `Page ${n}` })).toBeInTheDocument();
    }
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('collapses a large page range into first/last + neighbors + ellipsis', () => {
    render(<Pagination page={10} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 11' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 5' })).not.toBeInTheDocument();
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  it('Previous is disabled on the first page, Next on the last page', () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();

    rerender(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('clicking a page number calls onPageChange with that page', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    // page=3 keeps page 2 in the visible range (neighbors of the current
    // page, ±1) — with page=1 only 1, 2, and totalPages are visible.
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('clicking Next/Previous moves by one page', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('showFirstLast renders First/Last buttons that jump to the edges', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={5} totalPages={10} onPageChange={onPageChange} showFirstLast />);
    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it('showJumpTo submits a valid page number and clears the field', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={1} totalPages={20} onPageChange={onPageChange} showJumpTo />);
    const input = screen.getByLabelText(/Jump to page/);
    await user.type(input, '7');
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onPageChange).toHaveBeenCalledWith(7);
    expect(input).toHaveValue(null);
  });

  it('showJumpTo ignores an out-of-range page number', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} showJumpTo />);
    const input = screen.getByLabelText(/Jump to page/);
    await user.type(input, '999');
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
