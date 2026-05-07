'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  error,
  success,
  helperText,
  children,
}: FormFieldProps) => {
  const isError = !!error;
  const isSuccess = !!success && !error;

  return (
    <div className="flex flex-col gap-1 w-full">

      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-md transition",
          isError && "ring-2 ring-red-500",
          isSuccess && "ring-2 ring-green-500"
        )}
      >
        {children}
      </div>

      {isError ? (
        <span className="text-sm text-red-500">{error}</span>
      ) : isSuccess ? (
        <span className="text-sm text-green-600">{success}</span>
      ) : helperText ? (
        <span className="text-sm text-subtle">{helperText}</span>
      ) : null}
    </div>
  );
};

export default FormField;