import * as React from 'react';
import { CheckIcon } from '../../icons';
import { cx } from '../../utils';
import '../../base.css';
import './Stepper.css';

/*
 * Stepper — process steps indicator.
 *
 * <Stepper.Root activeStep={1}>
 *   <Stepper.Step label="Account" />
 *   <Stepper.Step label="Shipping" description="Where should we deliver?" />
 *   <Stepper.Step label="Payment" />
 * </Stepper.Root>
 *
 * Steps are index-based: everything before `activeStep` is completed,
 * everything after is upcoming. Passing `onStepClick` turns completed steps
 * into buttons so users can navigate back.
 */

export type StepperOrientation = 'horizontal' | 'vertical';

/** Step shape accepted by the `steps` array alternative to children. */
export interface StepperStepConfig {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Custom indicator content for non-completed steps (defaults to the step number). */
  icon?: React.ReactNode;
}

interface StepperContextValue {
  activeStep: number;
  onStepClick?: (index: number) => void;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

interface StepPositionContextValue {
  index: number;
  isLast: boolean;
}

const StepPositionContext = React.createContext<StepPositionContextValue | null>(null);

export interface StepperRootProps extends React.OlHTMLAttributes<HTMLOListElement> {
  /** Index of the current step (0-based). Steps before it are completed. */
  activeStep: number;
  /** @default 'horizontal' */
  orientation?: StepperOrientation;
  /** When provided, completed steps become clickable buttons. */
  onStepClick?: (index: number) => void;
  /** Array alternative to `<Stepper.Step>` children. */
  steps?: StepperStepConfig[];
}

const StepperRoot = React.forwardRef<HTMLOListElement, StepperRootProps>(function StepperRoot(
  { activeStep, orientation = 'horizontal', onStepClick, steps, className, children, ...props },
  ref
) {
  const context = React.useMemo(
    () => ({ activeStep, onStepClick }),
    [activeStep, onStepClick]
  );
  const items = React.Children.toArray(
    steps ? steps.map((step, index) => <StepperStep key={index} {...step} />) : children
  );
  return (
    <StepperContext.Provider value={context}>
      <ol
        ref={ref}
        className={cx('zest-stepper', className)}
        data-orientation={orientation}
        {...props}
      >
        {items.map((item, index) => (
          <StepPositionContext.Provider
            key={index}
            value={{ index, isLast: index === items.length - 1 }}
          >
            {item}
          </StepPositionContext.Provider>
        ))}
      </ol>
    </StepperContext.Provider>
  );
});

export interface StepperStepProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'children'>,
    StepperStepConfig {}

const StepperStep = React.forwardRef<HTMLLIElement, StepperStepProps>(function StepperStep(
  { label, description, icon, className, ...props },
  ref
) {
  const stepper = React.useContext(StepperContext);
  const position = React.useContext(StepPositionContext);
  if (!stepper || !position) {
    throw new Error('Stepper.Step must be rendered inside Stepper.Root');
  }

  const { activeStep, onStepClick } = stepper;
  const { index, isLast } = position;
  const status = index < activeStep ? 'completed' : index === activeStep ? 'active' : 'upcoming';
  const clickable = Boolean(onStepClick) && status === 'completed';

  const content = (
    <>
      <span className="zest-stepper__indicator" aria-hidden>
        {status === 'completed' ? <CheckIcon /> : (icon ?? index + 1)}
      </span>
      <span className="zest-stepper__text">
        <span className="zest-stepper__label">{label}</span>
        {description ? <span className="zest-stepper__description">{description}</span> : null}
      </span>
    </>
  );

  return (
    <li
      ref={ref}
      className={cx('zest-stepper__step', className)}
      data-status={status}
      data-clickable={clickable ? '' : undefined}
      {...props}
    >
      {clickable ? (
        <button
          type="button"
          className="zest-stepper__header zest-focusable"
          onClick={() => onStepClick?.(index)}
        >
          {content}
        </button>
      ) : (
        <div
          className="zest-stepper__header"
          aria-current={status === 'active' ? 'step' : undefined}
        >
          {content}
        </div>
      )}
      {!isLast ? <span className="zest-stepper__connector" aria-hidden /> : null}
    </li>
  );
});

export const Stepper = {
  Root: StepperRoot,
  Step: StepperStep,
};
