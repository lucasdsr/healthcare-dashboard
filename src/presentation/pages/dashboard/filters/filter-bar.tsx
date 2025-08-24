'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Select,
  SearchInput,
  DateInput,
  Badge,
} from '@/presentation/components';
import {
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
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
  onLoadingChange?: (loading: boolean) => void;
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
  onLoadingChange,
}) => {
  // Helper function to get default date range (first day of current month to today)
  const getDefaultDateRange = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start: firstDayOfMonth,
      end: today,
    };
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [patientSearchQuery, setPatientSearchQuery] = useState(
    filters.patient || ''
  );
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const { data: patientSearchResults, isLoading: isSearching } =
    usePatientSearch(patientSearchQuery);

  useEffect(() => {
    setPendingFilters(filters);
    setPatientSearchQuery(filters.patient || '');
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...pendingFilters, [key]: value };
    setPendingFilters(newFilters);

    if (key === 'patient') {
      setPatientSearchQuery(value || '');
    }
  };

  const handleApplyFilters = () => {
    setIsApplyingFilters(true);
    if (onLoadingChange) {
      onLoadingChange(true);
    }
    onFiltersChange(pendingFilters);

    // Stop loading after a delay
    setTimeout(() => {
      setIsApplyingFilters(false);
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }, 2000);
  };

  const handleResetFilters = () => {
    // Reset to default date range (first day of current month to today)
    const defaultFilters = {
      dateRange: getDefaultDateRange(),
    };

    setPendingFilters(defaultFilters);
    setPatientSearchQuery('');
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (value === undefined || value === null || value === '') return false;

    if (key === 'status' && Array.isArray(value)) {
      return value.length > 0;
    }

    if (key === 'dateRange' && typeof value === 'object' && value !== null) {
      const dateRange = value as { start?: Date; end?: Date };
      return dateRange.start !== undefined || dateRange.end !== undefined;
    }

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return true;
  });

  const hasPendingChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(filters);

  const isDateRangeValid = !(
    pendingFilters.dateRange?.start &&
    pendingFilters.dateRange?.end &&
    pendingFilters.dateRange.start > pendingFilters.dateRange.end
  );

  const formatDateRange = (start?: Date, end?: Date) => {
    if (!start && !end) return '';
    if (start && end) {
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
    if (start) return `From ${start.toLocaleDateString()}`;
    if (end) return `Until ${end.toLocaleDateString()}`;
    return '';
  };

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
    if (start && end && start > end) {
      return;
    }
    handleFilterChange(
      'dateRange',
      start && end ? { start, end } : start ? { start } : undefined
    );
  };

  const handleEndDateChange = (end: Date | undefined) => {
    const start = pendingFilters.dateRange?.start;
    if (start && end && start > end) {
      return;
    }
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
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-800 text-lg">
                Filters
              </span>
            </div>
            {hasActiveFilters && (
              <Badge variant="info" size="sm">
                Active
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2"
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
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
                      : `Until ${filters.dateRange.end.toLocaleDateString()}`}
                </Badge>
              )}
              {filters.patient && (
                <Badge variant="info" size="sm">
                  Patient: {patientSearchQuery || filters.patient}
                </Badge>
              )}
              {filters.practitioner && (
                <Badge variant="warning" size="sm">
                  Practitioner: {filters.practitioner}
                </Badge>
              )}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-6 space-y-6">
            {/* Status and Date Range Section */}
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
                    onChange={handleStatusChange}
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
                    onChange={handleStartDateChange}
                    max={
                      pendingFilters.dateRange?.end?.toISOString().split('T')[0]
                    }
                    placeholder="Select start date"
                    helpText="Choose the beginning of the date range"
                    clearable
                    required={!!pendingFilters.dateRange?.end}
                    error={
                      pendingFilters.dateRange?.start &&
                      pendingFilters.dateRange?.end &&
                      pendingFilters.dateRange.start >
                        pendingFilters.dateRange.end
                        ? 'Start date must be before end date'
                        : undefined
                    }
                  />
                </div>

                <div className="space-y-2">
                  <DateInput
                    label="End Date"
                    value={pendingFilters.dateRange?.end}
                    onChange={handleEndDateChange}
                    min={
                      pendingFilters.dateRange?.start
                        ?.toISOString()
                        .split('T')[0]
                    }
                    placeholder="Select end date"
                    helpText="Choose the end of the date range"
                    clearable
                    required={!!pendingFilters.dateRange?.start}
                    error={
                      pendingFilters.dateRange?.start &&
                      pendingFilters.dateRange?.end &&
                      pendingFilters.dateRange.start >
                        pendingFilters.dateRange.end
                        ? 'End date must be after start date'
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2 text-gray-500" />
                Search Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
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
                  <label className="block text-sm font-medium text-gray-700">
                    Patient Search
                  </label>
                  <p className="text-xs text-gray-500">
                    Search by patient name or ID to filter encounters
                  </p>
                </div>

                <div className="space-y-2">
                  <SearchInput
                    value={pendingFilters.practitioner || ''}
                    onChange={value =>
                      handleFilterChange('practitioner', value || undefined)
                    }
                    placeholder="Search by practitioner name..."
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Practitioner Search
                  </label>
                  <p className="text-xs text-gray-500">
                    Search by practitioner name to filter encounters
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {!isDateRangeValid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Date Range Error</p>
                    <p className="mt-1">
                      {pendingFilters.dateRange?.start &&
                      pendingFilters.dateRange?.end &&
                      pendingFilters.dateRange.start >
                        pendingFilters.dateRange.end
                        ? 'Start date must be before end date. Please adjust the dates to continue.'
                        : 'Please select a valid date range.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="success"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
              >
                Reset
              </Button>
              <Button
                variant="secondary"
                onClick={handleApplyFilters}
                disabled={
                  !hasPendingChanges || !isDateRangeValid || isApplyingFilters
                }
                className="relative"
              >
                {isApplyingFilters ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Applying...
                  </div>
                ) : (
                  <>
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Apply Filters
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
