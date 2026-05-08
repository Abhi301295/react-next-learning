import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  success?: string;
  helperText?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  htmlFor,
  error,
  success,
  helperText,
  children,
}: FormFieldProps) => {
  const isError = !!error;
  const isSuccess = !!success && !error;

  const labelEl =
    label && htmlFor ? (
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
    ) : label ? (
      <span className="text-sm font-medium text-foreground">{label}</span>
    ) : null;

  return (
    <div className="flex w-full flex-col gap-1">
      {labelEl}

      <div
        className={cn(
          'rounded-md transition',
          isError && 'ring-2 ring-red-500',
          isSuccess && 'ring-2 ring-green-500'
        )}
      >
        {children}
      </div>

      {isError ? (
        <span className="text-sm text-red-700">{error}</span>
      ) : isSuccess ? (
        <span className="text-sm text-green-600">{success}</span>
      ) : helperText ? (
        <span className="text-sm text-subtle">{helperText}</span>
      ) : null}
    </div>
  );
};

export default FormField;
