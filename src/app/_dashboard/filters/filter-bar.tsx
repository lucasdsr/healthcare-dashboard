'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Select,
  SearchInput,
  DateInput,
} from '@/presentation/components';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePatientSearch } from '@/infrastructure/queries/encounter-queries';

interface FilterOption {
  label: string;
  value: string;
  description?: string;
}

interface FilterBarProps {
  filters: {
    status?: FilterOption[];
    dateRange?: { start: Date; end: Date };
    patient?: string;
    practitioner?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS: FilterOption[] = [
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

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [patientSearchQuery, setPatientSearchQuery] = useState(
    filters.patient || ''
  );
  const [showPatientResults, setShowPatientResults] = useState(false);

  const { data: patientSearchResults, isLoading: isSearching } =
    usePatientSearch(patientSearchQuery);

  // Update pending filters when props change (e.g., after clear)
  useEffect(() => {
    setPendingFilters(filters);
    setPatientSearchQuery(filters.patient || '');
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...pendingFilters, [key]: value };
    setPendingFilters(newFilters);

    // Update patient search query if it's a patient filter
    if (key === 'patient') {
      setPatientSearchQuery(value || '');
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(pendingFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {};
    setPendingFilters(emptyFilters);
    setPatientSearchQuery('');
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== null && value !== ''
  );

  const hasPendingChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(filters);

  const handlePatientSelect = (result: {
    id: string;
    label: string;
    subtitle?: string;
  }) => {
    setPatientSearchQuery(result.label);
    setShowPatientResults(false);
    handleFilterChange('patient', result.id);
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange(
      'status',
      value
        ? [
            {
              value,
              label:
                STATUS_OPTIONS.find(opt => opt.value === value)?.label || value,
            },
          ]
        : undefined
    );
  };

  const handleStartDateChange = (start: Date | undefined) => {
    const end = pendingFilters.dateRange?.end;
    handleFilterChange(
      'dateRange',
      start && end ? { start, end } : start ? { start } : undefined
    );
  };

  const handleEndDateChange = (end: Date | undefined) => {
    const start = pendingFilters.dateRange?.start;
    handleFilterChange(
      'dateRange',
      start && end ? { start, end } : end ? { end } : undefined
    );
  };

  const formatPatientResults = () => {
    if (!patientSearchResults) return [];

    return patientSearchResults.map(patient => ({
      id: patient.id,
      label: patient.name?.[0]?.text || `Patient ${patient.id}`,
      subtitle: `ID: ${patient.id}`,
    }));
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-neutral-500" />
            <span className="font-medium text-neutral-700">Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <Select
                  options={STATUS_OPTIONS}
                  value={pendingFilters.status?.[0]?.value || ''}
                  onChange={handleStatusChange}
                  placeholder="All Statuses"
                  label="Status"
                  searchable
                  clearable
                  helpText="Filter encounters by their current status"
                />
              </div>

              {/* Date Range Filters */}
              <DateInput
                label="Start Date"
                value={pendingFilters.dateRange?.start}
                onChange={handleStartDateChange}
                max={pendingFilters.dateRange?.end?.toISOString().split('T')[0]}
                placeholder="Select start date"
                helpText="Choose the beginning of the date range"
                clearable
                required={!!pendingFilters.dateRange?.end}
              />

              <DateInput
                label="End Date"
                value={pendingFilters.dateRange?.end}
                onChange={handleEndDateChange}
                min={
                  pendingFilters.dateRange?.start?.toISOString().split('T')[0]
                }
                placeholder="Select end date"
                helpText="Choose the end of the date range"
                clearable
                required={!!pendingFilters.dateRange?.start}
              />
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Patient Search
                </label>
                <SearchInput
                  value={patientSearchQuery}
                  onChange={setPatientSearchQuery}
                  onSelect={handlePatientSelect}
                  placeholder="Search by patient name or ID..."
                  results={formatPatientResults()}
                  isLoading={isSearching}
                  showResults={showPatientResults}
                  onShowResultsChange={setShowPatientResults}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Practitioner Search
                </label>
                <SearchInput
                  value={pendingFilters.practitioner || ''}
                  onChange={value =>
                    handleFilterChange('practitioner', value || undefined)
                  }
                  placeholder="Search by practitioner name..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
              <Button
                variant="outline"
                onClick={() => setPendingFilters(filters)}
                disabled={!hasPendingChanges}
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                disabled={!hasPendingChanges}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
