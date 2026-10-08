import { describe, expect, it, vi } from 'vitest';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload, formatBytes } from './FileUpload';

function makeFile(name: string, size: number, type = 'text/plain'): File {
  return new File(['x'.repeat(size)], name, { type });
}

/* jsdom ignores `relatedTarget` in DragEvent init, so set it explicitly. */
function dragLeave(element: HTMLElement, relatedTarget: EventTarget) {
  const event = createEvent.dragLeave(element);
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  fireEvent(element, event);
}

function dropFiles(files: File[]) {
  const dropzone = screen.getByRole('button', { name: /drop files/i });
  fireEvent.drop(dropzone, { dataTransfer: { files } });
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

  it('rejects dropped files that do not match accept', () => {
    const onReject = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FileUpload
        accept="image/*,.pdf"
        multiple
        onReject={onReject}
        onValueChange={onValueChange}
      />
    );
    const png = makeFile('photo.png', 5, 'image/png');
    const pdf = makeFile('doc.PDF', 5, 'application/pdf');
    const txt = makeFile('notes.txt', 5);
    dropFiles([png, pdf, txt]);
    expect(onReject).toHaveBeenCalledWith([txt]);
    expect(onValueChange).toHaveBeenCalledWith([png, pdf]);
  });

  it('keeps the drag highlight while moving over child elements', () => {
    render(<FileUpload />);
    const dropzone = screen.getByRole('button', { name: /drop files/i });
    const child = dropzone.querySelector('.zest-file-upload__label') as HTMLElement;
    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveAttribute('data-dragging');
    dragLeave(dropzone, child);
    expect(dropzone).toHaveAttribute('data-dragging');
    dragLeave(dropzone, document.body);
    expect(dropzone).not.toHaveAttribute('data-dragging');
  });

  it('formats byte sizes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB');
  });
});
