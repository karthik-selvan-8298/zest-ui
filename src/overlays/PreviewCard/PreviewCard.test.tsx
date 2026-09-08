import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { PreviewCard } from './PreviewCard';

function renderCard(props: React.ComponentProps<typeof PreviewCard.Root> = {}) {
  return render(
    <PreviewCard.Root delay={0} closeDelay={0} {...props}>
      <PreviewCard.Trigger href="/ada">@ada</PreviewCard.Trigger>
      <PreviewCard.Content>Ada Lovelace</PreviewCard.Content>
    </PreviewCard.Root>
  );
}

describe('PreviewCard', () => {
  it('renders the trigger as a styled link and keeps the card closed', () => {
    renderCard();
    const link = screen.getByRole('link', { name: '@ada' });
    expect(link).toHaveAttribute('href', '/ada');
    expect(link).toHaveClass('zest-preview-card__trigger', 'zest-focusable');
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
  });

  it('opens on hover and closes when the pointer leaves', async () => {
    const onOpenChange = vi.fn();
    renderCard({ onOpenChange });
    const link = screen.getByRole('link', { name: '@ada' });

    await userEvent.hover(link);
    const popup = await screen.findByText('Ada Lovelace');
    expect(popup).toHaveClass('zest-preview-card');
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());

    await userEvent.unhover(link);
    await waitFor(() => expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it('renders content when controlled open', () => {
    render(
      <PreviewCard.Root open>
        <PreviewCard.Trigger href="#">link</PreviewCard.Trigger>
        <PreviewCard.Content arrow className="custom">
          Body
        </PreviewCard.Content>
      </PreviewCard.Root>
    );
    const popup = screen.getByText('Body');
    expect(popup).toHaveClass('zest-preview-card', 'custom');
    expect(popup.querySelector('.zest-preview-card__arrow')).not.toBeNull();
  });

  it('omits the arrow by default', () => {
    render(
      <PreviewCard.Root open>
        <PreviewCard.Trigger href="#">link</PreviewCard.Trigger>
        <PreviewCard.Content>Body</PreviewCard.Content>
      </PreviewCard.Root>
    );
    expect(document.querySelector('.zest-preview-card__arrow')).toBeNull();
  });

  it('lets Trigger render a custom element', () => {
    render(
      <PreviewCard.Root>
        <PreviewCard.Trigger render={<button type="button" />}>Open</PreviewCard.Trigger>
        <PreviewCard.Content>Body</PreviewCard.Content>
      </PreviewCard.Root>
    );
    expect(screen.getByRole('button', { name: 'Open' })).toHaveClass('zest-preview-card__trigger');
  });
});
