import * as React from 'react';
import {
  CheckCircleIcon,
  CloseIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  WarningTriangleIcon,
} from '../../icons';
import { cx } from '../../utils';
import { IconButton } from '../../actions/IconButton/IconButton';
import '../../base.css';
import './Alert.css';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

const defaultIcons: Record<AlertSeverity, React.ReactNode> = {
  info: <InfoCircleIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningTriangleIcon />,
  error: <ErrorCircleIcon />,
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  severity?: AlertSeverity;
  variant?: 'soft' | 'solid' | 'outlined';
  /** Bold first line. */
  title?: React.ReactNode;
  /** Custom leading icon; `null` hides it. */
  icon?: React.ReactNode | null;
  /** Called when the close button is clicked; renders the button when set. */
  onClose?: () => void;
  /** Trailing action area (e.g. a small Button). */
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    severity = 'info',
    variant = 'soft',
    title,
    icon,
    onClose,
    action,
    className,
    children,
    ...props
  },
  ref
) {
  // Announce warnings/errors assertively (`alert`), info/success politely
  // (`status`) — matches ARIA guidance so non-urgent alerts don't interrupt
  // screen-reader flow. Callers can override via `role` in `...props`.
  const defaultRole = severity === 'warning' || severity === 'error' ? 'alert' : 'status';
  return (
    <div
      ref={ref}
      role={defaultRole}
      className={cx('zest-alert', className)}
      data-accent={severity}
      data-variant={variant}
      {...props}
    >
      {icon === null ? null : (
        <span className="zest-alert__icon" aria-hidden>
          {icon ?? defaultIcons[severity]}
        </span>
      )}
      <div className="zest-alert__content">
        {title ? <div className="zest-alert__title">{title}</div> : null}
        {children ? <div className="zest-alert__message">{children}</div> : null}
      </div>
      {action ? <div className="zest-alert__action">{action}</div> : null}
      {onClose ? (
        <IconButton
          aria-label="Close alert"
          size="sm"
          variant="ghost"
          color="neutral"
          className="zest-alert__close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </div>
  );
});
