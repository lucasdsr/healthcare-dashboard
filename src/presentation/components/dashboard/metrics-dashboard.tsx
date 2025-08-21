'use client';

import React from 'react';
import { MetricCard } from './metric-card';
import { useEncounters } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';

export const MetricsDashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard
      title="Total Encounters"
      value="0"
      change={{ value: 12, isPositive: true }}
    />
    <MetricCard
      title="Active Encounters"
      value="0"
      change={{ value: 5, isPositive: true }}
    />
    <MetricCard
      title="Completed Today"
      value="0"
      change={{ value: 8, isPositive: true }}
    />
    <MetricCard
      title="Pending"
      value="0"
      change={{ value: 3, isPositive: false }}
    />
  </div>
);
