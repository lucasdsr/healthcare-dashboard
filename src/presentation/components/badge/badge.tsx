import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { BadgeProps } from './badge.interface';
import { badgeVariants, useBadgeLogic } from './badge.logic';

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, removable, onRemove, children, ...props },
    ref
  ) => {
    const { shouldShowRemoveButton } = useBadgeLogic();
    const showRemoveButton = shouldShowRemoveButton(
      removable || false,
      onRemove
    );

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        {showRemoveButton && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1.5 h-3 w-3 rounded-full hover:bg-current hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1"
          >
            <span className="sr-only">Remove</span>
            <svg
              className="h-2.5 w-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
