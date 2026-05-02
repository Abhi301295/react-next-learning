'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const Badge = ({ children, variant = 'default', className }: BadgeProps) => {

  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-md',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;