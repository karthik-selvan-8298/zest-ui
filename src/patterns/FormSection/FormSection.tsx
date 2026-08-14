import * as React from 'react';
import { cx } from '../../utils';
import './FormSection.css';

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Section heading. */
  title: React.ReactNode;
  /** Explains what the fields in this section do. */
  description?: React.ReactNode;
  /** Fields (usually a Stack of TextField/Select/etc). */
  children?: React.ReactNode;
  /** Two-column layout on wide screens (heading left, fields right). */
  layout?: 'stacked' | 'split';
}

/**
 * Groups related form fields under a heading — the standard settings-page
 * building block.
 */
export const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(function FormSection(
  { title, description, layout = 'split', className, children, ...props },
  ref
) {
  return (
    <section
      ref={ref}
      className={cx('zest-form-section', className)}
      data-layout={layout}
      {...props}
    >
      <header className="zest-form-section__header">
        <h3 className="zest-form-section__title">{title}</h3>
        {description ? <p className="zest-form-section__description">{description}</p> : null}
      </header>
      <div className="zest-form-section__fields">{children}</div>
    </section>
  );
});
