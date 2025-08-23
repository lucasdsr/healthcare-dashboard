import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from '@/presentation/components';
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
  isLoading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
  isLoading = false,
}) => (
  <Card
    className={cn(
      'hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
      className
    )}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-semibold text-gray-700">
        {title}
      </CardTitle>
      {icon && (
        <div className="h-6 w-6 text-gray-500 flex-shrink-0 bg-gray-100 p-1 rounded-lg">
          {icon}
        </div>
      )}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-24 flex items-center justify-center">
          <LoadingSpinner size="md" variant="purple" />
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {change && (
            <p
              className={cn(
                'text-xs font-medium',
                change.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change.isPositive ? '+' : ''}
              {change.value}% from last month
            </p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);
