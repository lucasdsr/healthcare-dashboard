'use client';

import React from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import { MetricLoading } from './metric-loading';
import { MetricError } from './metric-error';
import { MetricCards } from './metric-cards';

interface MetricsDashboardProps {
  filters?: any;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  filters,
}) => {
  const { data: metrics, isLoading, error } = useDashboardMetrics(filters);
  const { encounters } = useEncounterStore();

  if (isLoading) {
    return <MetricLoading />;
  }

  if (error) {
    return <MetricError />;
  }

  const totalEncounters =
    metrics?.totalEncounters || Object.keys(encounters).length || 0;
  const activeEncounters = metrics?.activeEncounters || 0;
  const dailyAverage = metrics?.dailyAverage || 0;

  // Check if we're using mock data (high numbers indicate mock data)
  const isUsingMockData = totalEncounters > 50000;

  return (
    <MetricCards
      totalEncounters={totalEncounters}
      activeEncounters={activeEncounters}
      dailyAverage={dailyAverage}
      isUsingMockData={isUsingMockData}
    />
  );
};
