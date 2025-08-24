'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { useMetricsLogic } from '@/presentation/hooks/metrics';
import { MetricCards } from './metric-cards';
import { QueryStateHandler } from '@/presentation/components';
import { EncounterFilters } from '@/shared/types/filters';

interface MetricsDashboardProps {
  filters?: EncounterFilters;
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

  const metricsLogic = useMetricsLogic({
    metrics,
    isQueryLoading,
    isFilterLoading,
  });

  return (
    <QueryStateHandler
      error={error}
      errorTitle="Error loading metrics"
      errorMessage={error?.message}
      errorSubtitle="Please check your API connection"
      showCard={false}
    >
      <MetricCards
        totalEncounters={metricsLogic.totalEncounters}
        activeEncounters={metricsLogic.activeEncounters}
        dailyAverage={metricsLogic.dailyAverage}
        isUsingMockData={metricsLogic.isUsingMockData}
        isLoading={metricsLogic.shouldShowLoading}
      />
    </QueryStateHandler>
  );
};
