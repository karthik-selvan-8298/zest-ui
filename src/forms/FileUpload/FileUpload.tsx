import * as React from 'react';
import { CloseIcon, UploadIcon } from '../../icons';
import { cx, useControllableState } from '../../utils';
import { IconButton } from '../../actions/IconButton/IconButton';
import '../../base.css';
import './FileUpload.css';

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Accepted types, native `accept` syntax (e.g. "image/*,.pdf"). */
  accept?: string;
  multiple?: boolean;
  /** Reject files larger than this (in megabytes). */
  maxSizeMB?: number;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  /** Called with files rejected by `accept`/`maxSizeMB`. */
  onReject?: (files: File[]) => void;
  disabled?: boolean;
  error?: boolean;
  /** Drop-zone headline. */
  label?: React.ReactNode;
  /** Secondary line under the headline. */
  description?: React.ReactNode;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Drag-and-drop file picker with a browse fallback and a removable file list.
 *
 * ```tsx
 * <FileUpload accept="image/*" multiple maxSizeMB={5} onValueChange={setFiles} />
 * ```
 */
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    accept,
    multiple = false,
    maxSizeMB,
    value,
    defaultValue = [],
    onValueChange,
    onReject,
    disabled = false,
    error = false,
    label = 'Drop files here or click to browse',
    description,
    className,
    ...props
  },
  ref
) {
  const [files, setFiles] = useControllableState<File[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || disabled) return;
    const accepted: File[] = [];
    const rejected: File[] = [];
    for (const file of Array.from(incoming)) {
      const tooBig = maxSizeMB !== undefined && file.size > maxSizeMB * 1024 * 1024;
      if (tooBig) rejected.push(file);
      else accepted.push(file);
    }
    if (rejected.length) onReject?.(rejected);
    if (accepted.length) setFiles(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div ref={ref} className={cx('zest-file-upload', className)} {...props}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        className="zest-file-upload__dropzone zest-focusable"
        data-dragging={dragging ? '' : undefined}
        data-error={error ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <span className="zest-file-upload__icon" aria-hidden>
          <UploadIcon />
        </span>
        <span className="zest-file-upload__label">{label}</span>
        {description ? (
          <span className="zest-file-upload__description">{description}</span>
        ) : maxSizeMB !== undefined ? (
          <span className="zest-file-upload__description">Max {maxSizeMB} MB per file</span>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          className="zest-visually-hidden"
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>
      {files.length > 0 ? (
        <ul className="zest-file-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="zest-file-upload__item">
              <span className="zest-file-upload__name">{file.name}</span>
              <span className="zest-file-upload__size">{formatBytes(file.size)}</span>
              <IconButton
                aria-label={`Remove ${file.name}`}
                size="sm"
                variant="ghost"
                color="neutral"
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <CloseIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
