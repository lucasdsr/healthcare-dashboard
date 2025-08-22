import React from 'react';
import { MetricCard } from '../metric-card';
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
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalEncounters,
  activeEncounters,
  dailyAverage,
  isUsingMockData,
}) => (
  <div className="space-y-4">
    {isUsingMockData && (
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          📊 Demo Mode - Using Sample Data
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Total Encounters"
        value={totalEncounters.toLocaleString()}
        icon={<UserGroupIcon className="h-5 w-5" />}
        change={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="Active Encounters"
        value={activeEncounters.toLocaleString()}
        icon={<ClockIcon className="h-5 w-5" />}
        change={{ value: 5, isPositive: true }}
      />
      <MetricCard
        title="Daily Average"
        value={dailyAverage.toLocaleString()}
        icon={<ChartBarIcon className="h-5 w-5" />}
        change={{ value: 8, isPositive: true }}
      />
    </div>
  </div>
);
