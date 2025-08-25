import React from 'react';
import { FilterBar } from '../filters/filter-bar';
import { MetricsDashboard } from '../metrics-dashboard/metrics-dashboard';
import {
  EncounterStatusChart,
  EncounterTrendsChart,
} from '@/presentation/components';
import { EncounterList } from '../encounter-list';
import { DashboardFilters } from '../filters/filter-bar.interface';

interface DashboardContentProps {
  filters: DashboardFilters;
  fhirFilters: any;
  isFilterLoading: boolean;
  onFiltersChange: (filters: DashboardFilters) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  filters,
  fhirFilters,
  isFilterLoading,
  onFiltersChange,
  onLoadingChange,
}) => (
  <div className="space-y-8">
    <FilterBar
      filters={filters}
      onFiltersChange={onFiltersChange}
      onLoadingChange={onLoadingChange}
    />

    <MetricsDashboard filters={fhirFilters} isFilterLoading={isFilterLoading} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <EncounterStatusChart
        filters={fhirFilters}
        isFilterLoading={isFilterLoading}
      />
      <EncounterTrendsChart
        filters={fhirFilters}
        isFilterLoading={isFilterLoading}
      />
    </div>

    <EncounterList filters={fhirFilters} isFilterLoading={isFilterLoading} />
  </div>
);
