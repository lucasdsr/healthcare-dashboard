import { FHIRApiClientImpl, FHIRBundle } from './fhir-api-client';
import { Encounter } from '@/domain/entities/encounter';
import { Patient } from '@/domain/entities/patient';
import { API_CONFIG } from '@/shared/config/api';
import { EncounterStatus } from '@/domain/entities/encounter';

export interface DashboardMetrics {
  totalEncounters: number;
  activeEncounters: number;
  dailyAverage: number;
  encountersByStatus: Record<string, number>;
  encountersByDate: Record<string, number>;
}

import { EncounterFilters as SharedEncounterFilters } from '@/shared/types/filters';

export interface EncounterFilters extends SharedEncounterFilters {
  dateRange?: { start: Date; end: Date };
}

export class FHIRService {
  private apiClient: FHIRApiClientImpl;

  constructor() {
    this.apiClient = new FHIRApiClientImpl(
      API_CONFIG.FHIR_BASE_URL,
      API_CONFIG.FHIR_API_KEY
    );
  }

  private shouldUseMockData(): boolean {
    return false;
  }

  async getDashboardMetrics(
    filters?: EncounterFilters,
    forceMockData: boolean = false
  ): Promise<DashboardMetrics> {
    if (forceMockData) {
      return this.getMockDashboardMetrics(filters);
    }

    try {
      const encounters = await this.apiClient.getEncounters({
        _count: 1000,
        ...this.transformFilters(filters),
      });

      if (encounters.length > 0) {
        return this.calculateMetricsFromRealData(encounters);
      }

      return this.getMockDashboardMetrics(filters);
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);

      if (error instanceof Error && error.message.includes('HAPI-1922')) {
        throw new Error(
          'Invalid date range filter. Please check your date selection and try again.'
        );
      }

      return this.getMockDashboardMetrics(filters);
    }
  }

  async getEncounters(
    filters?: EncounterFilters,
    forceMockData: boolean = false
  ): Promise<{
    encounters: Encounter[];
    total: number;
    pageSize: number;
    currentPage: number;
  }> {
    if (forceMockData) {
      const mockEncounters = this.getMockEncounters();
      const filteredEncounters = this.filterMockEncounters(
        mockEncounters,
        filters
      );

      const page = filters?._page || 1;
      const count = filters?._count || 50;
      const offset = (page - 1) * count;
      const paginatedEncounters = filteredEncounters.slice(
        offset,
        offset + count
      );

      return {
        encounters: paginatedEncounters,
        total: filteredEncounters.length,
        pageSize: count,
        currentPage: page,
      };
    }

    try {
      const transformedFilters = this.transformFilters(filters);
      const encounters = await this.apiClient.getEncounters(transformedFilters);

      if (encounters.length > 0) {
        const estimatedTotal =
          encounters.length + (transformedFilters._offset || 0);

        return {
          encounters,
          total: estimatedTotal,
          pageSize: transformedFilters._count || 50,
          currentPage: transformedFilters._page || 1,
        };
      }

      if (transformedFilters._offset === 0 && transformedFilters._count) {
        try {
          const retryFilters = { ...transformedFilters, _offset: 50 };
          const retryEncounters =
            await this.apiClient.getEncounters(retryFilters);

          if (retryEncounters.length > 0) {
            return {
              encounters: retryEncounters,
              total:
                retryEncounters.length + (transformedFilters._offset || 50),
              pageSize: transformedFilters._count || 50,
              currentPage: transformedFilters._page || 1,
            };
          }
        } catch (retryError) {}
      }

      const mockEncounters = this.getMockEncounters();
      const filteredEncounters = this.filterMockEncounters(
        mockEncounters,
        filters
      );

      const page = filters?._page || 1;
      const count = filters?._count || 50;
      const offset = (page - 1) * count;
      const paginatedEncounters = filteredEncounters.slice(
        offset,
        offset + count
      );

      return {
        encounters: paginatedEncounters,
        total: filteredEncounters.length,
        pageSize: count,
        currentPage: page,
      };
    } catch (error) {
      console.error('Failed to fetch encounters:', error);

      if (error instanceof Error && error.message.includes('HAPI-1922')) {
        throw new Error(
          'Invalid date range filter. Please check your date selection and try again.'
        );
      }

      const mockEncounters = this.getMockEncounters();
      const filteredEncounters = this.filterMockEncounters(
        mockEncounters,
        filters
      );

      const page = filters?._page || 1;
      const count = filters?._count || 50;
      const offset = (page - 1) * count;
      const paginatedEncounters = filteredEncounters.slice(
        offset,
        offset + count
      );

      return {
        encounters: paginatedEncounters,
        total: filteredEncounters.length,
        pageSize: count,
        currentPage: page,
      };
    }
  }

  async getEncounter(
    id: string,
    forceMockData: boolean = false
  ): Promise<Encounter> {
    if (forceMockData) {
      return this.getMockEncounter(id);
    }

    try {
      return await this.apiClient.getEncounter(id);
    } catch (error) {
      console.error(`Failed to fetch encounter ${id}:`, error);
      return this.getMockEncounter(id);
    }
  }

  async getPatient(
    id: string,
    forceMockData: boolean = false
  ): Promise<Patient> {
    if (forceMockData) {
      return this.getMockPatient(id);
    }

    try {
      return await this.apiClient.getPatient(id);
    } catch (error) {
      console.error(`Failed to fetch patient ${id}:`, error);
      return this.getMockPatient(id);
    }
  }

  async searchPatients(
    query: string,
    forceMockData: boolean = false
  ): Promise<Patient[]> {
    if (forceMockData) {
      return this.searchMockPatients(query);
    }

    try {
      const patients = await this.apiClient.getPatients({
        name: query,
        _count: 20,
      });

      if (patients.length > 0) {
        return patients;
      }

      return this.searchMockPatients(query);
    } catch (error) {
      console.error('Failed to search patients:', error);
      return this.searchMockPatients(query);
    }
  }

  private calculateMetricsFromRealData(
    encounters: Encounter[]
  ): DashboardMetrics {
    const totalEncounters = encounters.length;
    const activeEncounters = encounters.filter(
      e => e.status === 'in-progress'
    ).length;

    const encountersByStatus = encounters.reduce(
      (acc, encounter) => {
        acc[encounter.status] = (acc[encounter.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const encountersByDate = encounters.reduce(
      (acc, encounter) => {
        if (encounter.period?.start) {
          const date = encounter.period.start.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const dailyAverage =
      totalEncounters > 0 ? Math.round(totalEncounters / 30) : 0;

    return {
      totalEncounters,
      activeEncounters,
      dailyAverage,
      encountersByStatus,
      encountersByDate,
    };
  }

  private getMockDashboardMetrics(
    filters?: EncounterFilters
  ): DashboardMetrics {
    const mockEncounters = this.getMockEncounters();
    const filteredEncounters = this.filterMockEncounters(
      mockEncounters,
      filters
    );

    const totalEncounters = filteredEncounters.length;
    const activeEncounters = filteredEncounters.filter(
      e => e.status === 'in-progress'
    ).length;

    const encountersByStatus = filteredEncounters.reduce(
      (acc, encounter) => {
        acc[encounter.status] = (acc[encounter.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const encountersByDate = this.generateMockDateData(filters);

    const dailyAverage =
      totalEncounters > 0 ? Math.round(totalEncounters / 7) : 0;

    return {
      totalEncounters,
      activeEncounters,
      dailyAverage,
      encountersByStatus,
      encountersByDate,
    };
  }

  private generateMockDateData(
    filters?: EncounterFilters
  ): Record<string, number> {
    const dateData: Record<string, number> = {};

    if (filters?.dateRange?.start && filters?.dateRange?.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        dateData[dateString] = Math.floor(Math.random() * 200) + 150;
      }
    } else {
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dateData[dateString] = Math.floor(Math.random() * 200) + 150;
      }
    }

    return dateData;
  }

  private getMockEncounters(): Encounter[] {
    const mockEncounters: Encounter[] = [];
    const statuses: EncounterStatus[] = [
      'planned',
      'arrived',
      'triaged',
      'in-progress',
      'onleave',
      'finished',
      'cancelled',
    ];

    for (let i = 1; i <= 100; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));

      mockEncounters.push({
        id: `encounter-${i}`,
        resourceType: 'Encounter',
        status,
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: `Patient/patient-${Math.floor(Math.random() * 50) + 1}`,
          display: `Patient ${Math.floor(Math.random() * 50) + 1}`,
        },
        period: {
          start: startDate.toISOString(),
          end:
            status === 'finished'
              ? new Date(startDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
              : undefined,
        },
        serviceProvider: {
          reference: `Organization/org-${Math.floor(Math.random() * 10) + 1}`,
        },
      });
    }

    return mockEncounters;
  }

  private filterMockEncounters(
    encounters: Encounter[],
    filters?: EncounterFilters
  ): Encounter[] {
    let filtered = [...encounters];

    if (filters?.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    if (filters?.dateRange?.start && filters?.dateRange?.end) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(e => {
        if (!e.period?.start) return false;
        const encounterDate = new Date(e.period.start);
        return encounterDate >= start && encounterDate <= end;
      });
    }

    if (filters?.patient) {
      filtered = filtered.filter(e =>
        e.subject.reference?.includes(filters.patient!)
      );
    }

    return filtered;
  }

  private getMockEncounter(id: string): Encounter {
    return {
      id,
      resourceType: 'Encounter',
      status: 'in-progress',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'Ambulatory',
      },
      subject: {
        reference: 'Patient/patient-1',
        display: 'Patient 1',
      },
      period: {
        start: new Date().toISOString(),
      },
      serviceProvider: {
        reference: 'Organization/org-1',
      },
    };
  }

  private getMockPatient(id: string): Patient {
    return {
      id,
      resourceType: 'Patient',
      name: [
        {
          use: 'official',
          text: `Patient ${id}`,
          family: 'Smith',
          given: ['John'],
        },
      ],
      gender: 'male',
      birthDate: '1990-01-01',
    };
  }

  private searchMockPatients(query: string): Patient[] {
    const mockPatients: Patient[] = [];
    const names = [
      'John Smith',
      'Jane Doe',
      'Bob Johnson',
      'Alice Brown',
      'Charlie Wilson',
    ];

    for (let i = 1; i <= 20; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      if (
        name.toLowerCase().includes(query.toLowerCase()) ||
        query.includes(i.toString())
      ) {
        mockPatients.push({
          id: `patient-${i}`,
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              text: name,
              family: name.split(' ')[1],
              given: [name.split(' ')[0]],
            },
          ],
          gender: Math.random() > 0.5 ? 'male' : 'female',
          birthDate: new Date(
            1960 + Math.floor(Math.random() * 40),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split('T')[0],
        });
      }
    }

    return mockPatients;
  }

  private transformFilters(filters?: EncounterFilters) {
    const transformed: any = {};

    if (filters?.status) {
      transformed.status = filters.status;
    }

    if (filters?.dateRange?.start && filters?.dateRange?.end) {
      const startDate = filters.dateRange.start.toISOString().split('T')[0];
      const endDate = filters.dateRange.end.toISOString().split('T')[0];
      transformed.date = [`ge${startDate}`, `le${endDate}`];
    } else if (filters?.dateRange?.start) {
      const startDate = filters.dateRange.start.toISOString().split('T')[0];
      transformed.date = `ge${startDate}`;
    } else if (filters?.dateRange?.end) {
      const endDate = filters.dateRange.end.toISOString().split('T')[0];
      transformed.date = `le${endDate}`;
    }

    if (filters?.patient) {
      transformed.patient = filters.patient;
    }

    if (filters?._count) {
      transformed._count = filters._count;
    }

    if (filters?._page) {
      const page = filters._page;
      const count = filters._count || 50;
      const offset = (page - 1) * count;
      transformed._offset = page === 1 ? 0 : offset;
    } else {
      transformed._offset = 0;
    }

    return transformed;
  }
}

export const fhirService = new FHIRService();
