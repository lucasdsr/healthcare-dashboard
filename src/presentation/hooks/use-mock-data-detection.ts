import { useMemo } from 'react';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import { useDemoModeStore } from '@/infrastructure/store';

export const useMockDataDetection = () => {
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  const isUsingMockData = useMemo(() => isDemoModeEnabled, [isDemoModeEnabled]);

  return {
    isUsingMockData,
    isDemoModeEnabled,
    shouldShowDemoModeIndicator: isDemoModeEnabled,
  };
};
