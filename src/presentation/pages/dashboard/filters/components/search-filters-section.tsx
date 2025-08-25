import React from 'react';
import { SearchInput } from '@/presentation/components';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { DashboardFilters } from '../filter-bar.interface';

interface SearchFiltersSectionProps {
  pendingFilters: DashboardFilters;
  patientSearchQuery: string;
  showPatientResults: boolean;
  isSearching: boolean;
  onPatientSearchChange: (value: string) => void;
  onPatientSelect: (result: {
    id: string;
    label: string;
    subtitle?: string;
  }) => void;
  onShowPatientResultsChange: (show: boolean) => void;
  onFilterChange: (key: string, value: any) => void;
  formatPatientResults: () => Array<{
    id: string;
    label: string;
    subtitle?: string;
  }>;
}

export const SearchFiltersSection: React.FC<SearchFiltersSectionProps> = ({
  pendingFilters,
  patientSearchQuery,
  showPatientResults,
  isSearching,
  onPatientSearchChange,
  onPatientSelect,
  onShowPatientResultsChange,
  onFilterChange,
  formatPatientResults,
}) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
      <MagnifyingGlassIcon className="h-4 w-4 mr-2 text-gray-500" />
      Search Filters
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <SearchInput
          value={patientSearchQuery}
          onChange={onPatientSearchChange}
          onSelect={onPatientSelect}
          placeholder="Search by patient name or ID..."
          results={formatPatientResults()}
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
          onChange={value => onFilterChange('practitioner', value || undefined)}
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
);
