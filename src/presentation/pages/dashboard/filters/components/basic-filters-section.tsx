import React from 'react';
import { Select, DateInput } from '@/presentation/components';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { DashboardFilters } from '../filter-bar.interface';

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned', description: 'Appointment scheduled' },
  { value: 'arrived', label: 'Arrived', description: 'Patient has arrived' },
  {
    value: 'triaged',
    label: 'Triaged',
    description: 'Initial assessment completed',
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    description: 'Currently being treated',
  },
  {
    value: 'onleave',
    label: 'On Leave',
    description: 'Patient temporarily away',
  },
  { value: 'finished', label: 'Finished', description: 'Treatment completed' },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Appointment cancelled',
  },
];

interface BasicFiltersSectionProps {
  pendingFilters: DashboardFilters;
  onStatusChange: (value: string) => void;
  onStartDateChange: (start: Date | undefined) => void;
  onEndDateChange: (end: Date | undefined) => void;
}

export const BasicFiltersSection: React.FC<BasicFiltersSectionProps> = ({
  pendingFilters,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
}) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
      <FunnelIcon className="h-4 w-4 mr-2 text-gray-500" />
      Basic Filters
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Select
          options={STATUS_OPTIONS}
          value={pendingFilters.status?.[0]?.value || ''}
          onChange={onStatusChange}
          placeholder="All Statuses"
          label="Status"
          searchable
          clearable
          helpText="Filter encounters by their current status"
        />
      </div>

      <div className="space-y-2">
        <DateInput
          label="Start Date"
          value={pendingFilters.dateRange?.start}
          onChange={onStartDateChange}
          max={pendingFilters.dateRange?.end?.toISOString().split('T')[0]}
          placeholder="Select start date"
          helpText="Choose the beginning of the date range"
          clearable
          required={!!pendingFilters.dateRange?.end}
          error={
            pendingFilters.dateRange?.start &&
            pendingFilters.dateRange?.end &&
            pendingFilters.dateRange.start > pendingFilters.dateRange.end
              ? 'Start date must be before end date'
              : undefined
          }
        />
      </div>

      <div className="space-y-2">
        <DateInput
          label="End Date"
          value={pendingFilters.dateRange?.end}
          onChange={onEndDateChange}
          min={pendingFilters.dateRange?.start?.toISOString().split('T')[0]}
          placeholder="Select end date"
          helpText="Choose the end of the date range"
          clearable
          required={!!pendingFilters.dateRange?.start}
          error={
            pendingFilters.dateRange?.start &&
            pendingFilters.dateRange?.end &&
            pendingFilters.dateRange.start > pendingFilters.dateRange.end
              ? 'End date must be after start date'
              : undefined
          }
        />
      </div>
    </div>
  </div>
);
