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
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      role="status"
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