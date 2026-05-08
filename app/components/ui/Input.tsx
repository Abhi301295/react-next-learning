'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const isCheckboxLike = props.type === 'checkbox' || props.type === 'radio';

    const sizeStyles = {
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4',
    };

    const variantStyles = {
      default: 'border border-stroke bg-panel',
      outline: 'border-2 border-stroke bg-transparent',
      ghost: 'border-none bg-background',
    };

    const generatedId = useId();
    const inputId = id || generatedId;

    if (isCheckboxLike) {
      const isRadio = props.type === 'radio';
      return (
        <div className="flex flex-col gap-1">
          <label htmlFor={inputId} className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              ref={ref}
              id={inputId}
              type={props.type}
              checked={Boolean(props.checked)}
              onChange={props.onChange}
              name={props.name}
              value={props.value}
              disabled={props.disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className={cn(
                'h-4 w-4 border-stroke accent-brand-600',
                isRadio ? 'rounded-full' : 'rounded',
                'focus:outline-none focus:ring-2 focus:ring-brand-500',
                props.disabled && 'cursor-not-allowed opacity-50',
                className
              )}
            />
            {label && <span>{label}</span>}
          </label>
          {error ? (
            <span id={`${inputId}-error`} className="text-sm text-red-700">
              {error}
            </span>
          ) : (
            helperText && <span className="text-sm text-subtle">{helperText}</span>
          )}
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col gap-1">

        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex items-center rounded-md transition',
            variantStyles[variant],
            sizeStyles[inputSize],
            'focus-within:ring-2 focus-within:ring-brand-500',
            error && 'border-red-500 focus-within:ring-red-500',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
        >

          {leftIcon && (
            <span className="mr-2 flex items-center text-subtle">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'w-full bg-transparent outline-none',
              'placeholder:text-subtle',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="ml-2 flex items-center text-subtle">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <span id={`${inputId}-error`} className="text-sm text-red-700">
            {error}
          </span>
        ) : (
          helperText && (
            <span className="text-sm text-subtle">{helperText}</span>
          )
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
