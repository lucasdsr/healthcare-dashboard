'use client';

import React from 'react';
import { useDashboardLayoutLogic } from './dashboard-layout.logic';
import {
  DashboardHeader,
  ApiInfoCard,
  InitialLoading,
  DashboardContent,
} from './components';

export const DashboardLayout: React.FC = () => {
  const {
    filters,
    showInfo,
    isInitialLoad,
    isFilterLoading,
    handleFiltersChange,
    handleFilterLoading,
    toggleInfo,
    fhirFilters,
  } = useDashboardLayoutLogic();

  if (isInitialLoad) {
    return <InitialLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader showInfo={showInfo} onToggleInfo={toggleInfo} />
        <ApiInfoCard showInfo={showInfo} />

        <DashboardContent
          filters={filters}
          fhirFilters={fhirFilters}
          isFilterLoading={isFilterLoading}
          onFiltersChange={handleFiltersChange}
          onLoadingChange={handleFilterLoading}
        />
      </div>
    </div>
  );
};
