'use client';

import React from 'react';
import { Card, CardContent } from '@/presentation/components';
import { useFilterBarLogic } from './filter-bar.logic';
import { FilterBarProps } from './filter-bar.interface';
import {
  FilterHeader,
  ActiveFiltersDisplay,
  BasicFiltersSection,
  SearchFiltersSection,
  DateRangeError,
  FilterActions,
} from './components';

export const FilterBar: React.FC<FilterBarProps> = props => {
  const {
    isExpanded,
    pendingFilters,
    patientSearchQuery,
    showPatientResults,
    isApplyingFilters,
    isSearching,
    hasActiveFilters,
    hasPendingChanges,
    isDateRangeValid,
    toggleExpanded,
    handleFilterChange,
    handleApplyFilters,
    handleResetFilters,
    handlePatientSelect,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    formatPatientResults,
    setShowPatientResults,
  } = useFilterBarLogic(props);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <FilterHeader
          hasActiveFilters={hasActiveFilters}
          isExpanded={isExpanded}
          onToggleExpanded={toggleExpanded}
        />

        <ActiveFiltersDisplay
          filters={props.filters}
          patientSearchQuery={patientSearchQuery}
          hasActiveFilters={hasActiveFilters}
        />

        {isExpanded && (
          <div className="mt-6 space-y-6">
            <BasicFiltersSection
              pendingFilters={pendingFilters}
              onStatusChange={handleStatusChange}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />

            <SearchFiltersSection
              pendingFilters={pendingFilters}
              patientSearchQuery={patientSearchQuery}
              showPatientResults={showPatientResults}
              isSearching={isSearching}
              onPatientSearchChange={handleFilterChange.bind(null, 'patient')}
              onPatientSelect={handlePatientSelect}
              onShowPatientResultsChange={setShowPatientResults}
              onFilterChange={handleFilterChange}
              formatPatientResults={formatPatientResults}
            />

            <DateRangeError
              isDateRangeValid={isDateRangeValid}
              pendingFilters={pendingFilters}
            />

            <FilterActions
              hasActiveFilters={hasActiveFilters}
              hasPendingChanges={hasPendingChanges}
              isDateRangeValid={isDateRangeValid}
              isApplyingFilters={isApplyingFilters}
              onResetFilters={handleResetFilters}
              onApplyFilters={handleApplyFilters}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
