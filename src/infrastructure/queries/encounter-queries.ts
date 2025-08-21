import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { FhirClient } from '../api/fhir-client';
import { useEncounterStore } from '../store/encounter-store';

const fhirClient = new FhirClient(
  process.env.NEXT_PUBLIC_FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4'
);

export const useEncounters = (params: {
  _count?: number;
  _page?: number;
  status?: string;
  date?: string;
  patient?: string;
}) => {
  const { setEncounters, setPagination } = useEncounterStore();

  return useQuery({
    queryKey: ['encounters', params],
    queryFn: async () => {
      const result = await fhirClient.getEncounters(params);

      // Normalize and store data
      if (result.entry) {
        const encounters = result.entry.map(entry => entry.resource);
        setEncounters(encounters);

        // Extract pagination info
        if (result.total) {
          setPagination({
            totalCount: result.total,
            totalPages: Math.ceil(result.total / (params._count || 50)),
          });
        }
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInfiniteEncounters = (params: {
  _count?: number;
  status?: string;
  date?: string;
  patient?: string;
}) => {
  const { setEncounters } = useEncounterStore();

  return useInfiniteQuery({
    queryKey: ['encounters', 'infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fhirClient.getEncounters({
        ...params,
        _page: pageParam as number,
        _count: params._count || 50,
      });

      if (result.entry) {
        const encounters = result.entry.map(entry => entry.resource);
        setEncounters(encounters);
      }

      return result;
    },
    getNextPageParam: (lastPage: any, allPages) => {
      if (lastPage.entry && lastPage.entry.length === (params._count || 50)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useEncounter = (id: string) => {
  const { getEncounter, setEncounter } = useEncounterStore();

  return useQuery({
    queryKey: ['encounter', id],
    queryFn: async () => {
      const encounter = await fhirClient.getEncounter(id);
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
      const patient = await fhirClient.getPatient(id);
      setPatient(patient);
      return patient;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    initialData: getPatient(id),
  });
};

export const usePractitioner = (id: string) => {
  const { getPractitioner, setPractitioner } = useEncounterStore();

  return useQuery({
    queryKey: ['practitioner', id],
    queryFn: async () => {
      const practitioner = await fhirClient.getPractitioner(id);
      setPractitioner(practitioner);
      return practitioner;
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    initialData: getPractitioner(id),
  });
};

export const useOrganization = (id: string) => {
  const { getOrganization, setOrganization } = useEncounterStore();

  return useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const organization = await fhirClient.getOrganization(id);
      setOrganization(organization);
      return organization;
    },
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    initialData: getOrganization(id),
  });
};
