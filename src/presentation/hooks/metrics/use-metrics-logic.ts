import { useMemo } from 'react';
import { DashboardMetrics } from '@/infrastructure/api/fhir-service';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';

interface UseMetricsLogicProps {
  metrics?: DashboardMetrics;
  isQueryLoading: boolean;
  isFilterLoading: boolean;
}

export const useMetricsLogic = ({
  metrics,
  isQueryLoading,
  isFilterLoading,
}: UseMetricsLogicProps) => {
  const { encounters } = useEncounterStore();

  const shouldShowLoading = useMemo(
    () => isQueryLoading || isFilterLoading,
    [isQueryLoading, isFilterLoading]
  );

  const totalEncounters = useMemo(
    () => metrics?.totalEncounters || Object.keys(encounters).length || 0,
    [metrics?.totalEncounters, encounters]
  );

  const activeEncounters = useMemo(
    () => metrics?.activeEncounters || 0,
    [metrics?.activeEncounters]
  );

  const dailyAverage = useMemo(
    () => metrics?.dailyAverage || 0,
    [metrics?.dailyAverage]
  );

  const isUsingMockData = useMemo(
    () => totalEncounters > 50000,
    [totalEncounters]
  );

  return {
    shouldShowLoading,
    totalEncounters,
    activeEncounters,
    dailyAverage,
    isUsingMockData,
  };
};
