import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fhirService,
  EncounterFilters as FHIREncounterFilters,
} from '../api/fhir-service';
import { EncounterFilters } from '@/shared/types/filters';
import { useEncounterStore, useDemoModeStore } from '../store';

const transformFilters = (
  filters?: EncounterFilters
): FHIREncounterFilters | undefined => {
  if (!filters) return undefined;

  return {
    ...filters,
    dateRange:
      filters.dateRange?.start && filters.dateRange?.end
        ? { start: filters.dateRange.start, end: filters.dateRange.end }
        : undefined,
  };
};

export const useDashboardMetrics = (filters?: EncounterFilters) => {
  const { setEncounters } = useEncounterStore();
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  return useQuery({
    queryKey: ['dashboard-metrics', filters, isDemoModeEnabled],
    queryFn: async () => {
      const transformedFilters = transformFilters(filters);
      const metrics = await fhirService.getDashboardMetrics(
        transformedFilters,
        isDemoModeEnabled
      );

      if (filters) {
        const encountersData = await fhirService.getEncounters(
          transformedFilters,
          isDemoModeEnabled
        );
        setEncounters(encountersData.encounters);
      }

      return metrics;
    },
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnMount: true,
  });
};

export const useEncounters = (filters?: EncounterFilters) => {
  const { setEncounters, setPagination } = useEncounterStore();
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  const { _page, _count, ...searchFilters } = filters || {};
  const currentPage = _page || 1;
  const pageSize = _count || 50;

  return useQuery({
    queryKey: [
      'encounters',
      searchFilters,
      currentPage,
      pageSize,
      isDemoModeEnabled,
    ],
    queryFn: async () => {
      try {
        const transformedFilters = transformFilters({
          ...searchFilters,
          _page: currentPage,
          _count: pageSize,
        });

        const result = await fhirService.getEncounters(
          transformedFilters,
          isDemoModeEnabled
        );

        setEncounters(result.encounters);
        setPagination({
          currentPage: result.currentPage,
          totalCount: result.total,
          totalPages: Math.ceil(result.total / result.pageSize),
          pageSize: result.pageSize,
        });

        return result;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('Invalid date range filter')
        ) {
          throw new Error(
            'Please check your date range selection and try again.'
          );
        }

        throw error;
      }
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
};

export const useInfiniteEncounters = (filters?: EncounterFilters) => {
  const { setEncounters } = useEncounterStore();
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  return useInfiniteQuery({
    queryKey: ['encounters', 'infinite', filters, isDemoModeEnabled],
    queryFn: async ({ pageParam = 1 }) => {
      const transformedFilters = transformFilters({
        ...filters,
        _page: pageParam as number,
        _count: filters?._count || 50,
      });
      const result = await fhirService.getEncounters(
        transformedFilters,
        isDemoModeEnabled
      );

      setEncounters(result.encounters);
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.encounters.length === (filters?._count || 50)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
};

export const useEncounter = (id: string) => {
  const { getEncounter, setEncounter } = useEncounterStore();
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  return useQuery({
    queryKey: ['encounter', id, isDemoModeEnabled],
    queryFn: async () => {
      const encounter = await fhirService.getEncounter(id, isDemoModeEnabled);
      setEncounter(encounter);
      return encounter;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialData: getEncounter(id),
  });
};

export const usePatient = (id: string) => {
  const { getPatient, setPatient } = useEncounterStore();
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  return useQuery({
    queryKey: ['patient', id, isDemoModeEnabled],
    queryFn: async () => {
      const patient = await fhirService.getPatient(id, isDemoModeEnabled);
      setPatient(patient);
      return patient;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    initialData: getPatient(id),
  });
};

export const usePatientSearch = (query: string) => {
  const { isEnabled: isDemoModeEnabled } = useDemoModeStore();

  return useQuery({
    queryKey: ['patient-search', query, isDemoModeEnabled],
    queryFn: () => fhirService.searchPatients(query, isDemoModeEnabled),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
