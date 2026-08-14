import * as React from 'react';
import { SearchIcon, CloseIcon } from '../../icons';
import { useControllableState } from '../../utils';
import { Input, type InputProps } from '../Input/Input';
import { IconButton } from '../../actions/IconButton/IconButton';

export interface SearchInputProps
  extends Omit<InputProps, 'type' | 'startAdornment' | 'endAdornment' | 'value' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Hide the clear button. */
  disableClear?: boolean;
}

/** Search input with a leading search icon and a clear button. */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value: valueProp, defaultValue = '', onValueChange, disableClear, ...props },
    ref
  ) {
    const [value, setValue] = useControllableState<string>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });
    return (
      <Input
        ref={ref}
        type="search"
        role="searchbox"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        startAdornment={<SearchIcon />}
        endAdornment={
          !disableClear && value ? (
            <IconButton
              aria-label="Clear search"
              size="sm"
              variant="ghost"
              color="neutral"
              onClick={() => setValue('')}
            >
              <CloseIcon />
            </IconButton>
          ) : undefined
        }
        {...props}
      />
    );
  }
);
