import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { ButtonProps } from './button.interface';
import { buttonVariants, useButtonLogic } from './button.logic';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const { getButtonComponent } = useButtonLogic();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props,
      } as any);
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
