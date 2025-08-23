'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardMetrics } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import { MetricLoading } from './metric-loading';
import { MetricError } from './metric-error';
import { MetricCards } from './metric-cards';
import { LoadingSpinner } from '@/presentation/components';

interface MetricsDashboardProps {
  filters?: any;
  isFilterLoading?: boolean;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  filters,
  isFilterLoading = false,
}) => {
  const { data: metrics, error } = useDashboardMetrics(filters);
  const { encounters } = useEncounterStore();

  if (error) {
    return <MetricError />;
  }

  const totalEncounters =
    metrics?.totalEncounters || Object.keys(encounters).length || 0;
  const activeEncounters = metrics?.activeEncounters || 0;
  const dailyAverage = metrics?.dailyAverage || 0;

  const isUsingMockData = totalEncounters > 50000;

  return (
    <MetricCards
      totalEncounters={totalEncounters}
      activeEncounters={activeEncounters}
      dailyAverage={dailyAverage}
      isUsingMockData={isUsingMockData}
      isLoading={isFilterLoading}
    />
  );
};
