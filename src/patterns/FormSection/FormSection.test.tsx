import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormSection } from './FormSection';

describe('FormSection', () => {
  it('renders a section with an h3 title, description and fields', () => {
    const { container } = render(
      <FormSection title="Profile" description="How you appear.">
        <input aria-label="Display name" />
      </FormSection>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('zest-form-section');
    expect(section).toHaveAttribute('data-layout', 'split');
    expect(screen.getByRole('heading', { level: 3, name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByText('How you appear.')).toBeInTheDocument();
    expect(screen.getByLabelText('Display name').parentElement).toHaveClass(
      'zest-form-section__fields'
    );
  });

  it('supports the stacked layout and omits an empty description', () => {
    const { container } = render(<FormSection title="Notifications" layout="stacked" />);
    expect(container.querySelector('section')).toHaveAttribute('data-layout', 'stacked');
    expect(container.querySelector('.zest-form-section__description')).not.toBeInTheDocument();
  });
});
