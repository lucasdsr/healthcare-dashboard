'use client';

import React from 'react';
import {
  useFilterLogic,
  usePatientSearchLogic,
} from '@/presentation/hooks/filters';
import { EncounterFilters } from '@/shared/types/filters';
import { FilterBarUI } from './filter-bar-ui';

interface FilterBarContainerProps {
  filters: EncounterFilters;
  onFiltersChange: (filters: EncounterFilters) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const FilterBarContainer: React.FC<FilterBarContainerProps> = ({
  filters,
  onFiltersChange,
  onLoadingChange,
}) => {
  const filterLogic = useFilterLogic(filters);
  const patientSearch = usePatientSearchLogic(filters.patient);

  const handlePatientSelect = (result: {
    id: string;
    label: string;
    subtitle?: string;
  }) => {
    const patientId = patientSearch.handlePatientSelect(result);
    filterLogic.handleFilterChange('patient', patientId);
  };

  const handlePractitionerChange = (value: string) => {
    filterLogic.handleFilterChange('practitioner', value || undefined);
  };

  const handleResetFilters = () => {
    const defaultFilters = filterLogic.handleResetFilters();
    onFiltersChange(defaultFilters);
  };

  const handleApplyFilters = () => {
    filterLogic.handleApplyFilters(onFiltersChange, onLoadingChange);
  };

  return (
    <FilterBarUI
      filters={filters}
      pendingFilters={filterLogic.pendingFilters}
      hasActiveFilters={filterLogic.hasActiveFilters}
      hasPendingChanges={filterLogic.hasPendingChanges}
      isDateRangeValid={filterLogic.isDateRangeValid}
      isApplyingFilters={filterLogic.isApplyingFilters}
      formatDateRange={filterLogic.formatDateRange}
      onStatusChange={filterLogic.handleStatusChange}
      onStartDateChange={filterLogic.handleStartDateChange}
      onEndDateChange={filterLogic.handleEndDateChange}
      onPatientQueryChange={patientSearch.handlePatientQueryChange}
      onPatientSelect={handlePatientSelect}
      onPractitionerChange={handlePractitionerChange}
      onResetFilters={handleResetFilters}
      onApplyFilters={handleApplyFilters}
      patientSearchQuery={patientSearch.patientSearchQuery}
      showPatientResults={patientSearch.showPatientResults}
      isSearching={patientSearch.isSearching}
      patientSearchResults={patientSearch.patientSearchResults}
      onShowPatientResultsChange={patientSearch.setShowPatientResults}
    />
  );
};
