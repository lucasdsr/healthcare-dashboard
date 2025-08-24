import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        outline:
          'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        link: 'bg-transparent text-blue-600 underline-offset-4 hover:underline hover:bg-blue-50',
        success:
          'bg-green-600 text-success-foreground hover:bg-green-700 active:bg-green-800',
        warning:
          'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700',
        info: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 py-1.5 text-sm',
        lg: 'h-11 px-6 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const useButtonLogic = () => {
  const getButtonComponent = (asChild: boolean) =>
    asChild ? 'Slot' : 'button';

  return {
    getButtonComponent,
  };
};
