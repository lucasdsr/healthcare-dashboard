import React from 'react';
import { MetricCard } from '../metric-card';
import { DemoModeIndicator } from '../components/demo-mode-indicator';
import {
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface MetricCardsProps {
  totalEncounters: number;
  activeEncounters: number;
  dailyAverage: number;
  isUsingMockData: boolean;
  shouldShowDemoModeIndicator: boolean;
  isLoading?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalEncounters,
  activeEncounters,
  dailyAverage,
  isUsingMockData,
  shouldShowDemoModeIndicator,
  isLoading = false,
}) => (
  <div className="space-y-6">
    <DemoModeIndicator shouldShow={shouldShowDemoModeIndicator} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Encounters"
        value={totalEncounters.toLocaleString()}
        icon={<UserGroupIcon className="h-6 w-6" />}
        change={{ value: 12, isPositive: true }}
        isLoading={isLoading}
      />
      <MetricCard
        title="Active Encounters"
        value={activeEncounters.toLocaleString()}
        icon={<ClockIcon className="h-6 w-6" />}
        change={{ value: 5, isPositive: true }}
        isLoading={isLoading}
      />
      <MetricCard
        title="Daily Average"
        value={dailyAverage.toLocaleString()}
        icon={<ChartBarIcon className="h-6 w-6" />}
        change={{ value: 8, isPositive: true }}
        isLoading={isLoading}
      />
    </div>
  </div>
);
