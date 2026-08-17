import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDownIcon } from '../../icons';
import { cx } from '../../utils';
import type { WithClassName } from '../../types';
import '../../base.css';
import './Accordion.css';

/*
 * Accordion on Base UI — keyboard support, aria wiring, animated panels.
 *
 * <Accordion.Root defaultValue={['billing']} multiple>
 *   <Accordion.Item value="billing">
 *     <Accordion.Trigger>Billing</Accordion.Trigger>
 *     <Accordion.Panel>…</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion.Root>
 */

export type AccordionRootProps = WithClassName<React.ComponentProps<typeof BaseAccordion.Root>>;

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(
  { className, ...props },
  ref
) {
  return <BaseAccordion.Root ref={ref} className={cx('zest-accordion', className)} {...props} />;
});

export type AccordionItemProps = WithClassName<React.ComponentProps<typeof BaseAccordion.Item>>;

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, ...props },
  ref
) {
  return (
    <BaseAccordion.Item ref={ref} className={cx('zest-accordion__item', className)} {...props} />
  );
});

export type AccordionTriggerProps = WithClassName<
  React.ComponentProps<typeof BaseAccordion.Trigger>
>;

/** Header (h3) + trigger button with a rotating chevron. */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    return (
      <BaseAccordion.Header className="zest-accordion__header">
        <BaseAccordion.Trigger
          ref={ref}
          className={cx('zest-accordion__trigger', 'zest-focusable', className)}
          {...props}
        >
          <span className="zest-accordion__trigger-label">{children}</span>
          <span className="zest-accordion__chevron" aria-hidden>
            <ChevronDownIcon />
          </span>
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
    );
  }
);

export type AccordionPanelProps = WithClassName<React.ComponentProps<typeof BaseAccordion.Panel>>;

const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel({ className, children, ...props }, ref) {
    return (
      <BaseAccordion.Panel
        ref={ref}
        className={cx('zest-accordion__panel', className)}
        {...props}
      >
        {/* Height animates on the panel; padding lives on the inner wrapper. */}
        <div className="zest-accordion__panel-content">{children}</div>
      </BaseAccordion.Panel>
    );
  }
);

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
