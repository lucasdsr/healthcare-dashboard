import { Patient } from '@/domain/entities/patient';
import { Encounter } from '@/domain/entities/encounter';

export interface FHIRApiClient {
  getPatient(id: string): Promise<Patient>;
  getPatients(params?: PatientSearchParams): Promise<Patient[]>;
  getEncounter(id: string): Promise<Encounter>;
  getEncounters(params?: EncounterSearchParams): Promise<Encounter[]>;
  createPatient(patient: Omit<Patient, 'id'>): Promise<Patient>;
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient>;
  createEncounter(encounter: Omit<Encounter, 'id'>): Promise<Encounter>;
  updateEncounter(
    id: string,
    encounter: Partial<Encounter>
  ): Promise<Encounter>;
}

export interface PatientSearchParams {
  identifier?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthdate?: string;
  address?: string;
  _count?: number;
  _offset?: number;
}

export interface EncounterSearchParams {
  patient?: string;
  status?: string;
  date?: string;
  type?: string;
  location?: string;
  serviceprovider?: string;
  _count?: number;
  _offset?: number;
}

export class FHIRApiClientImpl implements FHIRApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/fhir+json',
    };

    if (apiKey) {
      this.headers['Authorization'] = `Bearer ${apiKey}`;
    }
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: this.headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getPatient(id: string): Promise<Patient> {
    return this.request<Patient>(`/Patient/${id}`);
  }

  async getPatients(params?: PatientSearchParams): Promise<Patient[]> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/Patient${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await this.request<{
      entry?: Array<{ resource: Patient }>;
    }>(endpoint);

    return response.entry?.map(entry => entry.resource) || [];
  }

  async getEncounter(id: string): Promise<Encounter> {
    return this.request<Encounter>(`/Encounter/${id}`);
  }

  async getEncounters(params?: EncounterSearchParams): Promise<Encounter[]> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/Encounter${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await this.request<{
      entry?: Array<{ resource: Encounter }>;
    }>(endpoint);

    return response.entry?.map(entry => entry.resource) || [];
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    return this.request<Patient>('/Patient', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    return this.request<Patient>(`/Patient/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  }

  async createEncounter(encounter: Omit<Encounter, 'id'>): Promise<Encounter> {
    return this.request<Encounter>('/Encounter', {
      method: 'POST',
      body: JSON.stringify(encounter),
    });
  }

  async updateEncounter(
    id: string,
    encounter: Partial<Encounter>
  ): Promise<Encounter> {
    return this.request<Encounter>(`/Encounter/${id}`, {
      method: 'PUT',
      body: JSON.stringify(encounter),
    });
  }
}
