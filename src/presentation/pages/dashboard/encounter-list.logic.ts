import { useState, useCallback, useMemo, useEffect } from 'react';
import { useEncounters } from '@/infrastructure/queries/encounter-queries';
import { useEncounterStore } from '@/infrastructure/store/encounter-store';
import { useMockDataDetection } from '@/presentation/hooks';
import { useDemoModeStore } from '@/infrastructure/store';
import {
  EncounterListLogic,
  EncounterListProps,
} from './interfaces/encounter-list.interface';

export const useEncounterListLogic = ({
  filters,
  isFilterLoading = false,
}: EncounterListProps): EncounterListLogic => {
  const {
    pagination,
    setPagination,
    encounters: storeEncounters,
  } = useEncounterStore();
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
    [setPagination]
  );

  useEffect(() => {
    setLocalCurrentPage(1);
  }, [filters]);

  const encounters = data?.encounters || [];
  const totalCount = data?.total || 0;
  const currentPage = localCurrentPage;
  const pageSize = data?.pageSize || pagination.pageSize;

  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();
  const { isUsingMockData, shouldShowDemoModeIndicator } =
    useMockDataDetection();

  const totalPages = useMemo(() => {
    if (!pageSize || pageSize === 0) return 1;
    const calculated = Math.ceil(totalCount / pageSize);
    return Math.max(calculated, 1);
  }, [totalCount, pageSize]);

  const listHeight = useMemo(() => {
    const itemHeight = 80;
    const maxHeight = 600;
    const calculatedHeight = Math.min(
      encounters.length * itemHeight,
      maxHeight
    );
    return Math.max(calculatedHeight, 200);
  }, [encounters.length]);

  useEffect(() => {
    if (data) {
      setPagination({
        currentPage: data.currentPage,
        totalCount: data.total,
        totalPages: Math.ceil(data.total / data.pageSize),
        pageSize: data.pageSize,
      });
    }
  }, [data, setPagination, filters, localCurrentPage]);

  return {
    encounters,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    listHeight,
    isLoading: isLoading || isFilterLoading,
    error,
    isDemoModeEnabled,
    shouldShowDemoModeIndicator,
    handlePageChange,
  };
};
