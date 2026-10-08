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
  /**
   * `split` puts the heading left and fields right from 900px up; `stacked`
   * always stacks them. @default 'split'
   */
  layout?: 'stacked' | 'split';
}

/**
 * Groups related form fields under a heading — the standard settings-page
 * building block. Renders a `<section>` with an `h3` title.
 *
 * ```tsx
 * <FormSection title="Profile" description="How you appear across the workspace.">
 *   <TextField label="Display name" fullWidth />
 * </FormSection>
 * ```
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
