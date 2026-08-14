import * as React from 'react';
import { EyeIcon, EyeOffIcon } from '../../icons';
import { Input, type InputProps } from '../Input/Input';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'endAdornment'> {
  /** Initial visibility of the password. */
  defaultVisible?: boolean;
}

/** Password input with a visibility toggle. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ defaultVisible = false, ...props }, ref) {
    const [visible, setVisible] = React.useState(defaultVisible);
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        endAdornment={
          <IconButton
            aria-label={visible ? 'Hide password' : 'Show password'}
            size="sm"
            variant="ghost"
            color="neutral"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </IconButton>
        }
        {...props}
      />
    );
  }
);
