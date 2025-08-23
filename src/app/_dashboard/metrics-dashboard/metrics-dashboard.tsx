'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import { MetricCards } from './metric-cards';
import { QueryStateHandler } from '@/presentation/components';

interface MetricsDashboardProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const {
    data: metrics,
    error,
    isLoading: isQueryLoading,
  } = useDashboardMetrics(filters);
  const { encounters } = useEncounterStore();

  const shouldShowLoading = isQueryLoading || isFilterLoading;

  return (
    <QueryStateHandler
      error={error}
      errorTitle="Error loading metrics"
      errorMessage={error?.message}
      errorSubtitle="Please check your API connection"
      showCard={false}
    >
      <MetricCards
        totalEncounters={
          metrics?.totalEncounters || Object.keys(encounters).length || 0
        }
        activeEncounters={metrics?.activeEncounters || 0}
        dailyAverage={metrics?.dailyAverage || 0}
        isUsingMockData={
          (metrics?.totalEncounters || Object.keys(encounters).length || 0) >
          50000
        }
        isLoading={shouldShowLoading}
      />
    </QueryStateHandler>
  );
};
