import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload, formatBytes } from './FileUpload';

function makeFile(name: string, size: number): File {
  return new File(['x'.repeat(size)], name, { type: 'text/plain' });
}

describe('FileUpload', () => {
  it('adds files through the hidden input', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<FileUpload onValueChange={onValueChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, makeFile('notes.txt', 10));
    expect(onValueChange).toHaveBeenCalled();
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
  });

  it('rejects files over maxSizeMB', async () => {
    const onReject = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <FileUpload maxSizeMB={0.00001} onReject={onReject} onValueChange={onValueChange} />
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, makeFile('big.txt', 1000));
    expect(onReject).toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('removes a file from the list', async () => {
    render(<FileUpload defaultValue={[makeFile('keep.txt', 5), makeFile('drop.txt', 5)]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove drop.txt' }));
    expect(screen.queryByText('drop.txt')).not.toBeInTheDocument();
    expect(screen.getByText('keep.txt')).toBeInTheDocument();
  });

  it('replaces the file when multiple is false', async () => {
    const { container } = render(<FileUpload defaultValue={[makeFile('old.txt', 5)]} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, makeFile('new.txt', 5));
    expect(screen.queryByText('old.txt')).not.toBeInTheDocument();
    expect(screen.getByText('new.txt')).toBeInTheDocument();
  });

  it('formats byte sizes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB');
  });
});
