import React from 'react';
import { cn } from '@/shared/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-neutral-600 text-center">{text}</p>
      )}
    </div>
  );
};
