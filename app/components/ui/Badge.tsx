'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string; // accessibility improvement
}

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ariaLabel,
}: BadgeProps) => {

  const variants = {
    default: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      aria-label={ariaLabel || String(children)}
      className={cn(
        'inline-flex items-center font-medium rounded-md',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;