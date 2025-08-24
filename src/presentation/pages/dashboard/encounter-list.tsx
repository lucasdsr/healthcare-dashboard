'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useEncounters } from '@/infrastructure/queries/encounter-queries';
import { Encounter } from '@/domain/entities/encounter';
import { Status } from '@/domain/value-objects/status';
import { DateRange } from '@/domain/value-objects/date-range';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  QueryStateHandler,
  LoadingSpinner,
} from '@/presentation/components';

interface EncounterListProps {
  filters?: any;
  isFilterLoading?: boolean;
}

interface EncounterRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    encounters: Encounter[];
  };
}

const EncounterRow: React.FC<EncounterRowProps> = React.memo(
  ({ index, style, data }) => {
    const encounter = data.encounters[index];

    if (!encounter) {
      return (
        <div style={style}>
          <div className="bg-white border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors last:border-b-0">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        </div>
      );
    }

    return (
      <div style={style}>
        <div className="bg-white border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors last:border-b-0">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-800 text-xs font-mono px-2 py-1 rounded-md">
                #{encounter.id || 'Unknown'}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                {encounter.subject?.reference || 'Unknown Patient'}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900">
                {encounter.period?.start
                  ? new Date(encounter.period.start).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium healthcare-status-${encounter.status}`}
              >
                {encounter.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EncounterRow.displayName = 'EncounterRow';

export function EncounterList({
  filters,
  isFilterLoading = false,
}: EncounterListProps) {
  const { pagination, setPagination } = useEncounterStore();
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const { data, isLoading, error } = useEncounters({
    ...filters,
    _count: pagination.pageSize,
    _page: localCurrentPage,
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      setLocalCurrentPage(newPage);
      setPagination({ currentPage: newPage });
    },
    [setPagination, localCurrentPage]
  );

  // Reset local page when filters change
  React.useEffect(() => {
    setLocalCurrentPage(1);
  }, [filters]);

  const encounters = data?.encounters || [];
  const totalCount = data?.total || 0;
  const currentPage = localCurrentPage;
  const pageSize = data?.pageSize || pagination.pageSize;

  const totalPages = useMemo(() => {
    if (!pageSize || pageSize === 0) return 1;
    const calculated = Math.ceil(totalCount / pageSize);
    return Math.max(calculated, 1);
  }, [totalCount, pageSize]);

  React.useEffect(() => {
    if (data) {
      setPagination({
        currentPage: data.currentPage,
        totalCount: data.total,
        totalPages: Math.ceil(data.total / data.pageSize),
        pageSize: data.pageSize,
      });
    }
  }, [data, setPagination, filters, localCurrentPage]);

  const listHeight = useMemo(() => {
    const itemHeight = 80;
    const maxHeight = 600;
    const calculatedHeight = Math.min(
      encounters.length * itemHeight,
      maxHeight
    );
    return Math.max(calculatedHeight, 200);
  }, [encounters.length]);

  if (isLoading || isFilterLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Encounters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center">
            <LoadingSpinner
              size="lg"
              text={
                isFilterLoading
                  ? 'Applying filters to data...'
                  : 'Loading Encounters...'
              }
              variant="purple"
            />
          </div>
        </CardContent>
      </Card>
    );
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
        <Card>
          <CardHeader>
            <CardTitle>Encounters ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {encounters.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No encounters found
              </p>
            ) : (
              <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                  <div className="grid grid-cols-4 gap-6">
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Patient
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </div>
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Status
                    </div>
                  </div>
                </div>
                <List
                  height={listHeight}
                  width="100%"
                  itemCount={encounters.length}
                  itemSize={80}
                  itemData={{ encounters }}
                  className="virtual-list-scrollbar"
                  overscanCount={5}
                >
                  {EncounterRow}
                </List>
              </div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalCount} total encounters
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Debug: localPage={localCurrentPage}, storePage=
                    {pagination.currentPage}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </QueryStateHandler>
  );
}
