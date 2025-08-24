import * as React from 'react';
import { VariantProps } from 'class-variance-authority';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof import('./button.logic').buttonVariants> {
  asChild?: boolean;
}
