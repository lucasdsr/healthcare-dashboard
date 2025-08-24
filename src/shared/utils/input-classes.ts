import { cn } from './cn';

export const getInputBaseClasses = (className?: string) =>
  cn(
    'w-full border rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'hover:border-gray-400 hover:shadow-sm',
    className
  );

export const getInputSizeClasses = () => ({
  sm: 'px-2 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
});

export const getInputStateClasses = (isError: boolean, disabled: boolean) => ({
  'border-red-300 focus:border-red-500 focus:ring-red-500': isError,
  'border-gray-300': !isError,
  'bg-gray-100 cursor-not-allowed': disabled,
  'bg-white': !disabled,
});

export const getInputPaddingClasses = (
  clearable: boolean,
  hasValue: boolean
) => ({
  'pr-10': clearable && hasValue,
  'pr-3': !clearable || !hasValue,
});

export const getSearchInputClasses = (className?: string) =>
  cn(
    'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 hover:shadow-sm',
    className
  );

export const getSelectBaseClasses = (className?: string) =>
  cn(
    'relative w-full border rounded-lg cursor-pointer transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
    'hover:border-gray-400 hover:shadow-sm',
    className
  );

export const getSelectStateClasses = (isError: boolean, disabled: boolean) => ({
  'border-red-300 focus-within:border-red-500 focus-within:ring-red-500':
    isError,
  'border-gray-300': !isError,
  'bg-gray-100 cursor-not-allowed': disabled,
  'bg-white': !disabled,
});
