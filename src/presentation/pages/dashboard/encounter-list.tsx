'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  QueryStateHandler,
} from '@/presentation/components';
import { useEncounterListLogic } from './encounter-list.logic';
import {
  DemoModeIndicator,
  EncounterLoadingState,
  EncounterTable,
  EncounterPagination,
} from './components';

export function EncounterList({
  filters,
  isFilterLoading = false,
}: {
  filters?: any;
  isFilterLoading?: boolean;
}) {
  const {
    encounters,
    totalCount,
    currentPage,
    totalPages,
    listHeight,
    isLoading,
    error,
    shouldShowDemoModeIndicator,
    handlePageChange,
  } = useEncounterListLogic({ filters, isFilterLoading });

  if (isLoading) {
    return <EncounterLoadingState isFilterLoading={isFilterLoading} />;
  }

  return (
    <QueryStateHandler
      error={error}
      errorTitle="Error loading encounters"
      errorMessage={error?.message}
      errorSubtitle="Please check your API connection"
      showCard={false}
    >
      <div className="space-y-4">
        <DemoModeIndicator shouldShow={shouldShowDemoModeIndicator} />

        <Card>
          <CardHeader>
            <CardTitle>Encounters ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <EncounterTable encounters={encounters} listHeight={listHeight} />
          </CardContent>
        </Card>

        <EncounterPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </QueryStateHandler>
  );
}
