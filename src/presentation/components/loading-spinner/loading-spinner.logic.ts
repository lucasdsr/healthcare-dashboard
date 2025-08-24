import { cn } from '@/shared/utils/cn';

export const useLoadingSpinnerLogic = () => {
  const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'h-4 w-4 border-b',
      md: 'h-8 w-8 border-b-2',
      lg: 'h-12 w-12 border-b-2',
    };
    return sizeClasses[size];
  };

  const getVariantClass = (variant: 'purple' | 'blue' | 'green') => {
    const variantClasses = {
      purple: 'border-purple-600',
      blue: 'border-blue-600',
      green: 'border-green-600',
    };
    return variantClasses[variant];
  };

  const getContainerClasses = (className?: string) =>
    cn('flex flex-col items-center justify-center', className);

  const getSpinnerClasses = (variantClass: string, sizeClass: string) =>
    cn('animate-spin rounded-full border-b-2', variantClass, sizeClass);

  const getTextClasses = () => 'mt-2 text-sm text-center';

  return {
    getSizeClass,
    getVariantClass,
    getContainerClasses,
    getSpinnerClasses,
    getTextClasses,
  };
};
