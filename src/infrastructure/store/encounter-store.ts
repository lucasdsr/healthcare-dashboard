import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Encounter } from '@/domain/entities/encounter';
import { Patient } from '@/domain/entities/patient';
import { Practitioner, Organization } from '@/infrastructure/api/fhir-client';

interface EncounterState {
  encounters: Record<string, Encounter>;
  patients: Record<string, Patient>;
  practitioners: Record<string, Practitioner>;
  organizations: Record<string, Organization>;

  // Loading states
  isLoading: boolean;
  loadingStates: Record<string, boolean>;

  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };

  // Actions
  setEncounters: (encounters: Encounter[]) => void;
  setEncounter: (encounter: Encounter) => void;
  setPatient: (patient: Patient) => void;
  setPractitioner: (practitioner: Practitioner) => void;
  setOrganization: (organization: Organization) => void;

  setLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;

  setPagination: (pagination: Partial<EncounterState['pagination']>) => void;

  // Selectors
  getEncounter: (id: string) => Encounter | undefined;
  getPatient: (id: string) => Patient | undefined;
  getPractitioner: (id: string) => Practitioner | undefined;
  getOrganization: (id: string) => Organization | undefined;

  getEncountersByStatus: (status: string) => Encounter[];
  getEncountersByPatient: (patientId: string) => Encounter[];
}

export const useEncounterStore = create<EncounterState>()(
  devtools(
    persist(
      (set, get) => ({
        encounters: {},
        patients: {},
        practitioners: {},
        organizations: {},

        isLoading: false,
        loadingStates: {},

        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          pageSize: 50,
        },

        setEncounters: encounters => {
          const encountersMap = encounters.reduce(
            (acc, encounter) => {
              acc[encounter.id] = encounter;
              return acc;
            },
            {} as Record<string, Encounter>
          );

          set(state => ({
            encounters: { ...state.encounters, ...encountersMap },
          }));
        },

        setEncounter: encounter => {
          set(state => ({
            encounters: { ...state.encounters, [encounter.id]: encounter },
          }));
        },

        setPatient: patient => {
          set(state => ({
            patients: { ...state.patients, [patient.id]: patient },
          }));
        },

        setPractitioner: practitioner => {
          set(state => ({
            practitioners: {
              ...state.practitioners,
              [practitioner.id]: practitioner,
            },
          }));
        },

        setOrganization: organization => {
          set(state => ({
            organizations: {
              ...state.organizations,
              [organization.id]: organization,
            },
          }));
        },

        setLoading: loading => set({ isLoading: loading }),

        setLoadingState: (key, loading) => {
          set(state => ({
            loadingStates: { ...state.loadingStates, [key]: loading },
          }));
        },

        setPagination: pagination => {
          set(state => ({
            pagination: { ...state.pagination, ...pagination },
          }));
        },

        getEncounter: id => get().encounters[id],
        getPatient: id => get().patients[id],
        getPractitioner: id => get().practitioners[id],
        getOrganization: id => get().organizations[id],

        getEncountersByStatus: status => {
          const state = get();
          return Object.values(state.encounters).filter(
            encounter => encounter.status === status
          );
        },

        getEncountersByPatient: patientId => {
          const state = get();
          return Object.values(state.encounters).filter(
            encounter => encounter.subject.reference === `Patient/${patientId}`
          );
        },
      }),
      {
        name: 'encounter-store',
        partialize: state => ({
          encounters: state.encounters,
          patients: state.patients,
          practitioners: state.practitioners,
          organizations: state.organizations,
        }),
      }
    )
  )
);
