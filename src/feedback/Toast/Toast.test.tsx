import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster, useToast, ZestToastProvider } from './Toast';

function Providers({ children }: { children?: React.ReactNode }) {
  return (
    <ZestToastProvider>
      {children}
      <Toaster />
    </ZestToastProvider>
  );
}

/** Mounts the provider + viewport; `result.current` is the `useToast()` API. */
function renderToasts() {
  return renderHook(() => useToast(), { wrapper: Providers }).result;
}

/** The toast element that contains the given text. */
async function findToast(text: string) {
  const title = await screen.findByText(text);
  const toast = title.closest('.zest-toast');
  if (!toast) throw new Error(`"${text}" is not inside a toast`);
  return toast;
}

describe('Toast', () => {
  it('shows a toast with its title, description and severity tone', async () => {
    const toasts = renderToasts();
    act(() => {
      toasts.current.add({
        title: 'Saved',
        description: 'All changes are stored.',
        severity: 'success',
      });
    });
    const el = await findToast('Saved');
    expect(el).toHaveAttribute('data-accent', 'success');
    expect(el.querySelector('.zest-toast__icon')).toBeInTheDocument();
    expect(screen.getByText('All changes are stored.')).toBeInTheDocument();
  });

  it('renders a plain toast without a tone or icon when severity is omitted', async () => {
    const toasts = renderToasts();
    act(() => {
      toasts.current.add({ title: 'Heads up' });
    });
    const el = await findToast('Heads up');
    expect(el).not.toHaveAttribute('data-accent');
    expect(el.querySelector('.zest-toast__icon')).toBeNull();
  });

  it('anchors the stack to the requested position', async () => {
    render(
      <ZestToastProvider>
        <Toaster position="top-right" />
      </ZestToastProvider>
    );
    await waitFor(() =>
      expect(document.querySelector('.zest-toaster')).toHaveAttribute('data-position', 'top-right')
    );
  });

  it('runs the action handler', async () => {
    const onClick = vi.fn();
    const toasts = renderToasts();
    act(() => {
      toasts.current.add({ title: 'Deleted', action: { label: 'Undo', onClick } });
    });
    await userEvent.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('closes a toast from its close button and from the API', async () => {
    const toasts = renderToasts();
    act(() => {
      toasts.current.add({ title: 'First' });
    });
    // Base UI keeps the close button out of the accessibility tree until the
    // stack is hovered or focused.
    await userEvent.hover(await findToast('First'));
    await userEvent.click(await screen.findByRole('button', { name: 'Close notification' }));
    await waitFor(() => expect(screen.queryByText('First')).not.toBeInTheDocument());

    let id = '';
    act(() => {
      id = toasts.current.add({ title: 'Second' });
    });
    await findToast('Second');
    act(() => toasts.current.close(id));
    await waitFor(() => expect(screen.queryByText('Second')).not.toBeInTheDocument());
  });

  it('useToast() keeps one identity across toast updates', async () => {
    const effect = vi.fn();
    const { result } = renderHook(
      () => {
        const toast = useToast();
        // An effect that lists `toast` as a dependency must not re-run (or
        // loop) every time a toast is added.
        React.useEffect(() => {
          effect();
        }, [toast]);
        return toast;
      },
      { wrapper: Providers }
    );
    const initial = result.current;
    act(() => {
      result.current.add({ title: 'One' });
    });
    await findToast('One');
    act(() => {
      result.current.add({ title: 'Two' });
    });
    await findToast('Two');
    expect(result.current).toBe(initial);
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('promise toasts move from loading to a success tone', async () => {
    const toasts = renderToasts();
    let resolve: (value: string) => void = () => {};
    const pending = new Promise<string>((done) => {
      resolve = done;
    });
    act(() => {
      void toasts.current.promise(pending, {
        loading: 'Saving…',
        success: (name) => `Saved ${name}`,
        error: 'Save failed',
      });
    });
    expect(await findToast('Saving…')).not.toHaveAttribute('data-accent');
    await act(async () => {
      resolve('report.pdf');
      await pending;
    });
    expect(await findToast('Saved report.pdf')).toHaveAttribute('data-accent', 'success');
  });

  it('promise toasts keep the default tone when a stage passes severity: undefined', async () => {
    const toasts = renderToasts();
    const failure = Promise.reject(new Error('offline'));
    act(() => {
      toasts.current
        .promise(failure, {
          loading: 'Saving…',
          success: 'Saved',
          error: { title: 'Save failed', severity: undefined },
        })
        .catch(() => {});
    });
    expect(await findToast('Save failed')).toHaveAttribute('data-accent', 'error');
  });

  it('promise toasts let a stage override the default tone', async () => {
    const toasts = renderToasts();
    act(() => {
      void toasts.current.promise(Promise.resolve(), {
        loading: 'Syncing…',
        success: { title: 'Synced with warnings', severity: 'warning' },
        error: 'Sync failed',
      });
    });
    expect(await findToast('Synced with warnings')).toHaveAttribute('data-accent', 'warning');
  });

  it('a loading stage severity does not leak into the next stage', async () => {
    const toasts = renderToasts();
    let resolve: () => void = () => {};
    const pending = new Promise<void>((done) => {
      resolve = done;
    });
    act(() => {
      void toasts.current.promise(pending, {
        loading: { title: 'Uploading…', severity: 'info' },
        success: 'Uploaded',
        error: 'Upload failed',
      });
    });
    expect(await findToast('Uploading…')).toHaveAttribute('data-accent', 'info');
    await act(async () => {
      resolve();
      await pending;
    });
    expect(await findToast('Uploaded')).toHaveAttribute('data-accent', 'success');
  });
});
