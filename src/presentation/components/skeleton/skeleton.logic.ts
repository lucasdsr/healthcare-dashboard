import { cn } from '@/shared/utils/cn';

export const useSkeletonLogic = () => {
  const getSkeletonClasses = (className?: string) =>
    cn('animate-pulse rounded-md bg-neutral-200', className);

  const getMetricCardSkeletonClasses = () => ({
    container: 'p-6 border border-neutral-200 rounded-lg bg-white',
    header: 'flex items-center justify-between mb-4',
    title: 'h-4 w-24',
    icon: 'h-4 w-4',
    value: 'h-8 w-16 mb-2',
    subtitle: 'h-3 w-32',
  });

  return {
    getSkeletonClasses,
    getMetricCardSkeletonClasses,
  };
};
