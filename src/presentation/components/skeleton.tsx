import React from 'react';
import { cn } from '@/shared/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
}) => (
  <div
    className={cn('animate-pulse rounded-md bg-neutral-200', className)}
    style={{
      width: width,
      height: height,
    }}
  />
);

export const MetricCardSkeleton: React.FC = () => (
  <div className="p-6 border border-neutral-200 rounded-lg bg-white">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
    </div>
    <Skeleton className="h-8 w-16 mb-2" />
    <Skeleton className="h-3 w-32" />
  </div>
);
