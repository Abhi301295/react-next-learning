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

const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  className,
  ...props
}: InputProps) => {

  const sizeStyles = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
  };

  const variantStyles = {
    default: 'border bg-white',
    outline: 'border-2 bg-transparent',
    ghost: 'border-none bg-gray-100',
  };

  const generatedId = useId();
  const inputId = props.id || generatedId;
  return (
    <div className="flex flex-col gap-1 w-full">

      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex items-center rounded-md transition',
          variantStyles[variant],
          sizeStyles[inputSize],
          'focus-within:ring-2 focus-within:ring-blue-500',
          error && 'border-red-500 focus-within:ring-red-500',
          props.disabled && 'opacity-50 cursor-not-allowed'
        )}
      >

        {leftIcon && (
          <span className="mr-2 flex items-center text-gray-500">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full bg-transparent outline-none',
            'placeholder:text-gray-400',
            className
          )}
        />

        {rightIcon && (
          <span className="ml-2 flex items-center text-gray-500">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-red-500">{error}</span>
      ) : (
        helperText && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )
      )}
    </div>
  );
};

export default Input;