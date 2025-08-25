import { useMemo } from 'react';
import { DashboardMetrics } from '@/infrastructure/api/fhir-service';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import { useDemoModeStore } from '@/infrastructure/store';
import { useMockDataDetection } from '../use-mock-data-detection';

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

  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  const { isUsingMockData, shouldShowDemoModeIndicator } =
    useMockDataDetection();

  return {
    shouldShowLoading,
    totalEncounters,
    activeEncounters,
    dailyAverage,
    isUsingMockData,
    shouldShowDemoModeIndicator,
  };
};
