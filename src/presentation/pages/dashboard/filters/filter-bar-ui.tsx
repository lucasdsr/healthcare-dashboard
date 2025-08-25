'use client';

import React, { useState } from 'react';
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
import {
  EncounterFilters,
  FilterState,
  PatientSearchResult,
} from '@/shared/types/filters';

interface FilterBarUIProps {
  filters: EncounterFilters;
  pendingFilters: FilterState;
  hasActiveFilters: boolean;
  hasPendingChanges: boolean;
  isDateRangeValid: boolean;
  isApplyingFilters: boolean;
  formatDateRange: (start?: Date, end?: Date) => string;
  onStatusChange: (value: string) => void;
  onStartDateChange: (start: Date | undefined) => void;
  onEndDateChange: (end: Date | undefined) => void;
  onPatientQueryChange: (value: string) => void;
  onPatientSelect: (result: PatientSearchResult) => void;
  onPractitionerChange: (value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  patientSearchQuery: string;
  showPatientResults: boolean;
  isSearching: boolean;
  patientSearchResults: PatientSearchResult[];
  onShowPatientResultsChange: (show: boolean) => void;
}

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

export const FilterBarUI: React.FC<FilterBarUIProps> = ({
  filters,
  pendingFilters,
  hasActiveFilters,
  hasPendingChanges,
  isDateRangeValid,
  isApplyingFilters,
  formatDateRange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onPatientQueryChange,
  onPatientSelect,
  onPractitionerChange,
  onResetFilters,
  onApplyFilters,
  patientSearchQuery,
  showPatientResults,
  isSearching,
  patientSearchResults,
  onShowPatientResultsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
              {filters.status && (
                <Badge variant="default" size="sm">
                  Status: {filters.status}
                </Badge>
              )}
              {filters.dateRange && (
                <Badge variant="success" size="sm">
                  Date Range:{' '}
                  {formatDateRange(
                    filters.dateRange.start,
                    filters.dateRange.end
                  )}
                </Badge>
              )}
              {filters.patient && (
                <Badge variant="success" size="sm">
                  Patient: {patientSearchQuery || filters.patient}
                </Badge>
              )}
              {filters.practitioner && (
                <Badge variant="success" size="sm">
                  Practitioner: {filters.practitioner}
                </Badge>
              )}
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-6 space-y-6">
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
                    onChange={onEndDateChange}
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

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2 text-gray-500" />
                Search Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <SearchInput
                    value={patientSearchQuery}
                    onChange={onPatientQueryChange}
                    onSelect={onPatientSelect}
                    placeholder="Search by patient name or ID..."
                    results={patientSearchResults}
                    isLoading={isSearching}
                    showResults={showPatientResults}
                    onShowResultsChange={onShowPatientResultsChange}
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
                    onChange={onPractitionerChange}
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
                      Start date must be before end date. Please adjust the
                      dates to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="success"
                onClick={onResetFilters}
                disabled={!hasActiveFilters}
              >
                Reset
              </Button>
              <Button
                variant="secondary"
                onClick={onApplyFilters}
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
