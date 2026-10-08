import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './Fieldset.css';

export type FieldsetLegendProps = WithClassName<React.ComponentProps<typeof BaseFieldset.Legend>>;

/** Legend styled like Typography `subtitle2`; auto-associated with the fieldset. */
const FieldsetLegend = React.forwardRef<HTMLDivElement, FieldsetLegendProps>(
  function FieldsetLegend({ className, ...props }, ref) {
    return (
      <BaseFieldset.Legend
        ref={ref}
        className={cx('zest-fieldset__legend', className)}
        {...props}
      />
    );
  }
);

export type FieldsetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Supporting copy under the legend (text-secondary / xs). */
const FieldsetDescription = React.forwardRef<HTMLParagraphElement, FieldsetDescriptionProps>(
  function FieldsetDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx('zest-fieldset__description', className)} {...props} />;
  }
);

export interface FieldsetProps extends WithClassName<
  React.ComponentProps<typeof BaseFieldset.Root>
> {
  /** Convenience legend. Alternative to a `Fieldset.Legend` child. */
  legend?: React.ReactNode;
  /**
   * Convenience description rendered under the legend and wired to the
   * fieldset via `aria-describedby`.
   */
  description?: React.ReactNode;
  /** Spacing between the grouped fields. Defaults to `md` (16px). */
  gap?: 'sm' | 'md' | 'lg';
  /** Disables every control inside (native fieldset behaviour). */
  disabled?: boolean;
  children?: React.ReactNode;
}

const FieldsetRoot = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  {
    legend,
    description,
    gap = 'md',
    className,
    children,
    'aria-describedby': describedBy,
    ...props
  },
  ref
) {
  // Only the convenience `description` is auto-wired; a composed
  // Fieldset.Description needs an explicit id + aria-describedby.
  const descriptionId = React.useId();
  const hasHeader = Boolean(legend || description);

  return (
    <BaseFieldset.Root
      ref={ref}
      className={cx('zest-fieldset', className)}
      data-gap={gap}
      aria-describedby={description ? cx(describedBy, descriptionId) : describedBy}
      {...props}
    >
      {hasHeader ? (
        <div className="zest-fieldset__header">
          {legend ? <FieldsetLegend>{legend}</FieldsetLegend> : null}
          {description ? (
            <FieldsetDescription id={descriptionId}>{description}</FieldsetDescription>
          ) : null}
        </div>
      ) : null}
      {children}
    </BaseFieldset.Root>
  );
});

/**
 * Fieldset — groups related fields under a legend on Base UI Fieldset.
 * Callable directly with the convenience props, or composed from its parts.
 *
 * ```tsx
 * <Fieldset legend="Billing address" description="Where we send invoices.">
 *   <TextField label="Street" />
 *   <TextField label="City" />
 * </Fieldset>
 *
 * <Fieldset.Root>
 *   <Fieldset.Legend>Notifications</Fieldset.Legend>
 *   <Fieldset.Description>Choose what we email you about.</Fieldset.Description>
 *   …
 * </Fieldset.Root>
 * ```
 */
export const Fieldset = Object.assign(FieldsetRoot, {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
});
