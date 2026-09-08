import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Meter } from './Meter';

describe('Meter', () => {
  it('renders a meter named by its label with the current value', () => {
    render(<Meter value={40} label="Storage" />);
    const meter = screen.getByRole('meter', { name: 'Storage' });
    expect(meter).toHaveAttribute('aria-valuenow', '40');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveClass('zest-meter');
  });

  it('accepts aria-label instead of a visible label', () => {
    render(<Meter value={10} aria-label="Battery" />);
    expect(screen.getByRole('meter', { name: 'Battery' })).toBeInTheDocument();
    expect(document.querySelector('.zest-meter__header')).toBeNull();
  });

  it('shows the formatted value when showValue is set', () => {
    render(<Meter value={72} label="Quota" showValue />);
    expect(screen.getByText('72%')).toHaveClass('zest-meter__value');
  });

  it('stamps color and size data attributes', () => {
    render(<Meter value={5} label="x" color="info" size="sm" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('data-accent', 'info');
    expect(meter).toHaveAttribute('data-size', 'sm');
  });

  it('escalates the accent across thresholds', () => {
    const thresholds = { warning: 80, error: 95 };
    const { rerender } = render(<Meter value={60} label="x" thresholds={thresholds} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-accent', 'primary');

    rerender(<Meter value={80} label="x" thresholds={thresholds} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-accent', 'warning');

    rerender(<Meter value={95} label="x" thresholds={thresholds} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-accent', 'error');
  });

  it('applies an error-only threshold without a warning step', () => {
    render(<Meter value={90} label="x" color="success" thresholds={{ error: 85 }} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-accent', 'error');
  });

  it('exposes segments via a CSS local and data flag', () => {
    render(<Meter value={50} label="x" segments={4} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('data-segmented');
    expect(meter.style.getPropertyValue('--_segments')).toBe('4');
  });

  it('ignores segments <= 1', () => {
    render(<Meter value={50} label="x" segments={1} />);
    expect(screen.getByRole('meter')).not.toHaveAttribute('data-segmented');
  });

  it('respects a custom min/max range', () => {
    render(<Meter value={5} min={0} max={10} label="Rating" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuemax', '10');
    expect(meter).toHaveAttribute('aria-valuenow', '5');
  });
});
