import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { cn } from '@/shared/utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => (
  <Card className={cn('hover:shadow-md transition-shadow', className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-neutral-600">
        {title}
      </CardTitle>
      {icon && (
        <div className="h-5 w-5 text-neutral-400 flex-shrink-0">{icon}</div>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-neutral-900 mb-1">{value}</div>
      {change && (
        <p
          className={cn(
            'text-xs',
            change.isPositive
              ? 'text-healthcare-success-600'
              : 'text-healthcare-danger-600'
          )}
        >
          {change.isPositive ? '+' : ''}
          {change.value}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);
