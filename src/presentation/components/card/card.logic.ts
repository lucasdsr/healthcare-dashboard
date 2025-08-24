import { cn } from '@/shared/utils/cn';

export const useCardLogic = () => {
  const getCardClasses = (className?: string) =>
    cn(
      'rounded-lg border border-gray-200 bg-white text-card-foreground shadow-md',
      className
    );

  const getCardHeaderClasses = (className?: string) =>
    cn('flex flex-col space-y-1.5 p-6', className);

  const getCardTitleClasses = (className?: string) =>
    cn('text-2xl font-semibold leading-none tracking-tight', className);

  const getCardDescriptionClasses = (className?: string) =>
    cn('text-sm text-muted-foreground', className);

  const getCardContentClasses = (className?: string) =>
    cn('p-6 pt-0', className);

  const getCardFooterClasses = (className?: string) =>
    cn('flex items-center p-6 pt-0', className);

  return {
    getCardClasses,
    getCardHeaderClasses,
    getCardTitleClasses,
    getCardDescriptionClasses,
    getCardContentClasses,
    getCardFooterClasses,
  };
};
