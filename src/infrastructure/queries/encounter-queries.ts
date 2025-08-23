import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fhirService,
  DashboardMetrics,
  EncounterFilters,
} from '../api/fhir-service';
import { useEncounterStore } from '../store/encounter-store';

export const useDashboardMetrics = (filters?: EncounterFilters) => {
  const { setEncounters } = useEncounterStore();

  return useQuery({
    queryKey: ['dashboard-metrics', filters],
    queryFn: async () => {
      const metrics = await fhirService.getDashboardMetrics(filters);

      if (filters) {
        const encountersData = await fhirService.getEncounters(filters);
        setEncounters(encountersData.encounters);
      }

      return metrics;
    },
    staleTime: 30 * 1000, // 30 seconds - more responsive for dashboard
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true, // Always refetch when component mounts
  });
};

export const useEncounters = (filters?: EncounterFilters) => {
  const { setEncounters, setPagination } = useEncounterStore();

  const { _page, _count, ...searchFilters } = filters || {};
  const currentPage = _page || 1;
  const pageSize = _count || 50;

  return useQuery({
    queryKey: ['encounters', searchFilters, currentPage, pageSize],
    queryFn: async () => {
      try {
        const result = await fhirService.getEncounters({
          ...searchFilters,
          _page: currentPage,
          _count: pageSize,
        });

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

  return useInfiniteQuery({
    queryKey: ['encounters', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fhirService.getEncounters({
        ...filters,
        _page: pageParam as number,
        _count: filters?._count || 50,
      });

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

  return useQuery({
    queryKey: ['encounter', id],
    queryFn: async () => {
      const encounter = await fhirService.getEncounter(id);
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

  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const patient = await fhirService.getPatient(id);
      setPatient(patient);
      return patient;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    initialData: getPatient(id),
  });
};

export const usePatientSearch = (query: string) =>
  useQuery({
    queryKey: ['patient-search', query],
    queryFn: () => fhirService.searchPatients(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
