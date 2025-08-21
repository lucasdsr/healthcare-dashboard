'use client';

import React from 'react';
import { MetricCard } from './metric-card';
import { useEncounters } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import {
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const MetricsDashboard: React.FC = () => {
  const { data: encountersData, isLoading } = useEncounters({ _count: 1000 });
  const { encounters, getEncountersByStatus } = useEncounterStore();

  // Use actual data if available, otherwise fallback to mock data
  const totalEncounters = Object.keys(encounters).length || 50243;
  const activeEncounters = getEncountersByStatus('in-progress').length || 7842;

  // Calculate daily average based on actual data or use mock
  const dailyAverage =
    Object.keys(encounters).length > 0
      ? Math.round(Object.keys(encounters).length / 30)
      : 678;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-neutral-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Total de Encounters"
        value={totalEncounters.toLocaleString()}
        icon={<UserGroupIcon className="h-5 w-5" />}
        change={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="Encounters Ativos"
        value={activeEncounters.toLocaleString()}
        icon={<ClockIcon className="h-5 w-5" />}
        change={{ value: 5, isPositive: true }}
      />
      <MetricCard
        title="Média Diária"
        value={dailyAverage.toLocaleString()}
        icon={<ChartBarIcon className="h-5 w-5" />}
        change={{ value: 8, isPositive: true }}
      />
    </div>
  );
};
