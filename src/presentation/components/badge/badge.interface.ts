import * as React from 'react';
import { VariantProps } from 'class-variance-authority';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof import('./badge.logic').badgeVariants> {
  removable?: boolean;
  onRemove?: () => void;
}
