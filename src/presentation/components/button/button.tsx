import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/shared/utils/cn';
import { ButtonProps } from './button.interface';
import { buttonVariants, useButtonLogic } from './button.logic';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const { getButtonComponent } = useButtonLogic();
    const Comp = getButtonComponent(asChild) === 'Slot' ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
