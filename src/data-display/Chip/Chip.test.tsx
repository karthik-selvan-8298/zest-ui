import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip label="Design" />);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders children as the label', () => {
    render(<Chip>Engineering</Chip>);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('fires onDelete from an accessible remove button', async () => {
    const onDelete = vi.fn();
    render(<Chip label="Design" onDelete={onDelete} />);
    const remove = screen.getByRole('button', { name: 'Remove' });
    await userEvent.click(remove);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when clickable', async () => {
    const onClick = vi.fn();
    render(<Chip label="Pick me" clickable onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Pick me' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick alongside onDelete without firing the other handler', async () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    render(<Chip label="Both" onClick={onClick} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /Both/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Chip label="Nope" clickable disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Nope' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onDelete when disabled', async () => {
    const onDelete = vi.fn();
    render(<Chip label="Nope" disabled onDelete={onDelete} />);
    const remove = screen.getByRole('button', { name: 'Remove' });
    expect(remove).toBeDisabled();
    await userEvent.click(remove);
    expect(onDelete).not.toHaveBeenCalled();
  });
});
