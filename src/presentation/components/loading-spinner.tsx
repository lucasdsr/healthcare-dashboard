import React from 'react';
import { cn } from '@/shared/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  variant?: 'default' | 'purple' | 'blue';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  variant = 'purple',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-12 w-12',
  };

  const variantClasses = {
    default: 'border-neutral-300 border-t-blue-600',
    purple: 'border-purple-200 border-t-purple-600',
    blue: 'border-blue-200 border-t-blue-600',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-b-2',
          variantClasses[variant],
          sizeClasses[size]
        )}
      />

      {text && <p className="mt-2 text-sm text-center">{text}</p>}
    </div>
  );
};
