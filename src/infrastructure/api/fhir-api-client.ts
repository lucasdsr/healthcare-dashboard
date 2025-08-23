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
  date?: string | string[];
  type?: string;
  location?: string;
  serviceprovider?: string;
  _count?: number;
  _offset?: number;
}

export interface FHIRBundle<T> {
  resourceType: 'Bundle';
  type:
    | 'searchset'
    | 'collection'
    | 'history'
    | 'batch'
    | 'transaction'
    | 'document'
    | 'message';
  total?: number;
  entry?: Array<{ resource: T }>;
  link?: Array<{ relation: string; url: string }>;
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

    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getPatient(id: string): Promise<Patient> {
    return this.request<Patient>(`/Patient/${id}`);
  }

  async getPatients(params?: PatientSearchParams): Promise<Patient[]> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/Patient${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await this.request<FHIRBundle<Patient>>(endpoint);

    return response.entry?.map(entry => entry.resource) || [];
  }

  async getEncounter(id: string): Promise<Encounter> {
    return this.request<Encounter>(`/Encounter/${id}`);
  }

  async getEncounters(params?: EncounterSearchParams): Promise<Encounter[]> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'date' && Array.isArray(value)) {
            value.forEach(v => searchParams.append('date', v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = `/Encounter${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    const response = await this.request<FHIRBundle<Encounter>>(endpoint);

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
