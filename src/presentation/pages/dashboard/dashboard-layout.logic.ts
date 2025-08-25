import { useState, useCallback, useEffect } from 'react';
import { DashboardLayoutLogic } from './interfaces/dashboard-layout.interface';
import { DashboardFilters } from './filters/filter-bar.interface';

const transformFiltersToFHIR = (filters: DashboardFilters) => {
  const fhirFilters: any = {};

  if (filters.status && filters.status.length > 0) {
    fhirFilters.status = filters.status[0].value;
  }

  if (filters.dateRange) {
    fhirFilters.dateRange = filters.dateRange;
  }

  if (filters.patient) {
    fhirFilters.patient = filters.patient;
  }

  if (filters.practitioner) {
    fhirFilters.practitioner = filters.practitioner;
  }

  return fhirFilters;
};

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstDayOfMonth,
    end: today,
  };
};

export const useDashboardLayoutLogic = (): DashboardLayoutLogic => {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: getDefaultDateRange(),
  });
  const [showInfo, setShowInfo] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);

      if (isFirstRender) {
        setIsFilterLoading(true);
        setTimeout(() => {
          setIsFilterLoading(false);
          setIsFirstRender(false);
        }, 500);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isFirstRender]);

  const handleFiltersChange = useCallback((newFilters: DashboardFilters) => {
    setFilters(newFilters);
  }, []);

  const handleFilterLoading = useCallback((loading: boolean) => {
    setIsFilterLoading(loading);
  }, []);

  const toggleInfo = useCallback(() => {
    setShowInfo(!showInfo);
  }, [showInfo]);

  const fhirFilters = transformFiltersToFHIR(filters);

  return {
    filters,
    showInfo,
    isInitialLoad,
    isFilterLoading,
    isFirstRender,
    handleFiltersChange,
    handleFilterLoading,
    toggleInfo,
    fhirFilters,
  };
};
