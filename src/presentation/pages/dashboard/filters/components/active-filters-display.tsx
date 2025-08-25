import React from 'react';
import { Badge } from '@/presentation/components';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { DashboardFilters } from '../filter-bar.interface';

interface ActiveFiltersDisplayProps {
  filters: DashboardFilters;
  patientSearchQuery: string;
  hasActiveFilters: boolean;
}

export const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
  filters,
  patientSearchQuery,
  hasActiveFilters,
}) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
        <FunnelIcon className="h-4 w-4 mr-2 text-gray-500" />
        Active Filters
      </h3>
      <div className="flex flex-wrap gap-2">
        {filters.status && filters.status.length > 0 && (
          <Badge variant="default" size="sm">
            Status: {filters.status[0].label}
          </Badge>
        )}
        {filters.dateRange && (
          <Badge variant="success" size="sm">
            Date Range:{' '}
            {filters.dateRange.start && filters.dateRange.end
              ? `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`
              : filters.dateRange.start
                ? `From ${filters.dateRange.start.toLocaleDateString()}`
                : filters.dateRange.end
                  ? `Until ${filters.dateRange.end.toLocaleDateString()}`
                  : 'Invalid range'}
          </Badge>
        )}
        {filters.patient && (
          <Badge variant="info" size="sm">
            Patient: {patientSearchQuery || filters.patient}
          </Badge>
        )}
        {filters.practitioner && (
          <Badge variant="info" size="sm">
            Practitioner: {filters.practitioner}
          </Badge>
        )}
      </div>
    </div>
  );
};
