import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from '@/presentation/components';
import { useMetricCardLogic } from './metric-card.logic';
import { MetricCardProps } from './interfaces/metric-card.interface';

export const MetricCard: React.FC<MetricCardProps> = props => {
  const { cardClassName, changeTextClassName, changeText } =
    useMetricCardLogic(props);
  const { title, value, change, icon, isLoading = false } = props;

  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 text-gray-500 flex-shrink-0 bg-gray-100 p-1.5 rounded-lg flex items-center justify-center">
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
            {change && <p className={changeTextClassName}>{changeText}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
};
