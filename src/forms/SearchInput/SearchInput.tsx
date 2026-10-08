import * as React from 'react';
import { SearchIcon, CloseIcon } from '../../icons';
import { useControllableState } from '../../utils';
import { Input, type InputProps } from '../Input/Input';
import { IconButton } from '../../actions/IconButton/IconButton';

/** Adornment slots are owned by the built-in search icon and clear button. */
export interface SearchInputProps extends Omit<
  InputProps,
  'type' | 'startAdornment' | 'endAdornment' | 'startIcon' | 'endIcon' | 'value' | 'onChange'
> {
  /** The search text. Use when controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Hide the clear button. */
  disableClear?: boolean;
}

/**
 * Search input with a leading search icon and a clear button that appears
 * once there is text.
 *
 * ```tsx
 * <SearchInput aria-label="Search members" value={query} onValueChange={setQuery} />
 * ```
 */
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
    // Owned locally (and exposed as the forwarded ref) so clearing can
    // return focus to the input — the clear button unmounts once empty.
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    return (
      <Input
        ref={inputRef}
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
              onClick={() => {
                setValue('');
                inputRef.current?.focus();
              }}
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
