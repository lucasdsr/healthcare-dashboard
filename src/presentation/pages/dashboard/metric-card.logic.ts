import { useMemo } from 'react';
import { cn } from '@/shared/utils/cn';
import {
  MetricCardLogic,
  MetricCardProps,
} from './interfaces/metric-card.interface';

export const useMetricCardLogic = ({
  change,
  className,
}: MetricCardProps): MetricCardLogic => {
  const cardClassName = useMemo(
    () =>
      cn(
        'hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
        className
      ),
    [className]
  );

  const changeTextClassName = useMemo(
    () =>
      cn(
        'text-xs font-medium',
        change?.isPositive ? 'text-green-600' : 'text-red-600'
      ),
    [change?.isPositive]
  );

  const changeText = useMemo(() => {
    if (!change) return '';
    return `${change.isPositive ? '+' : ''}${change.value}% from last month`;
  }, [change]);

  return {
    cardClassName,
    changeTextClassName,
    changeText,
  };
};
