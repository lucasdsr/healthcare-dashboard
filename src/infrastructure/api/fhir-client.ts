import { HttpClient } from './http-client';
import { Encounter } from '@/domain/entities/encounter';
import { Patient } from '@/domain/entities/patient';
import { Reference } from '@/shared/types/fhir';

export interface Bundle<T> {
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
  entry?: Array<{
    resource: T;
    fullUrl?: string;
    search?: {
      mode?: 'match' | 'include' | 'outcome';
      score?: number;
    };
  }>;
  link?: Array<{
    relation: string;
    url: string;
  }>;
}

export interface Practitioner {
  id: string;
  resourceType: 'Practitioner';
  identifier?: Array<{
    system?: string;
    value?: string;
  }>;
  name?: Array<{
    use?: string;
    text?: string;
    family?: string;
    given?: string[];
  }>;
  telecom?: Array<{
    system?: string;
    value?: string;
    use?: string;
  }>;
  address?: Array<{
    use?: string;
    type?: string;
    text?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  photo?: Array<{
    contentType?: string;
    url?: string;
  }>;
}

export interface Organization {
  id: string;
  resourceType: 'Organization';
  identifier?: Array<{
    system?: string;
    value?: string;
  }>;
  name?: string;
  alias?: string[];
  telecom?: Array<{
    system?: string;
    value?: string;
    use?: string;
  }>;
  address?: Array<{
    use?: string;
    type?: string;
    text?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
  contact?: Array<{
    purpose?: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
    };
    name?: {
      use?: string;
      text?: string;
      family?: string;
      given?: string[];
    };
    telecom?: Array<{
      system?: string;
      value?: string;
      use?: string;
    }>;
  }>;
}

export class FhirClient {
  private httpClient: HttpClient;

  constructor(baseURL: string) {
    this.httpClient = new HttpClient(baseURL);
  }

  async getEncounters(params: {
    _count?: number;
    _page?: number;
    status?: string;
    date?: string;
    patient?: string;
  }): Promise<Bundle<Encounter>> {
    const queryParams = new URLSearchParams();

    if (params._count) queryParams.append('_count', params._count.toString());
    if (params._page) queryParams.append('_page', params._page.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.date) queryParams.append('date', params.date);
    if (params.patient) queryParams.append('patient', params.patient);

    return this.httpClient.get<Bundle<Encounter>>(`/Encounter?${queryParams}`);
  }

  async getPatients(params: {
    _count?: number;
    _page?: number;
    name?: string;
    gender?: string;
    birthdate?: string;
  }): Promise<Bundle<Patient>> {
    const queryParams = new URLSearchParams();

    if (params._count) queryParams.append('_count', params._count.toString());
    if (params._page) queryParams.append('_page', params._page.toString());
    if (params.name) queryParams.append('name', params.name);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.birthdate) queryParams.append('birthdate', params.birthdate);

    return this.httpClient.get<Bundle<Patient>>(`/Patient?${queryParams}`);
  }

  async getPatient(id: string): Promise<Patient> {
    return this.httpClient.get<Patient>(`/Patient/${id}`);
  }

  async getEncounter(id: string): Promise<Encounter> {
    return this.httpClient.get<Encounter>(`/Encounter/${id}`);
  }

  async getPractitioner(id: string): Promise<Practitioner> {
    return this.httpClient.get<Practitioner>(`/Practitioner/${id}`);
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.httpClient.get<Organization>(`/Organization/${id}`);
  }

  async resolveReference<T>(reference: Reference): Promise<T> {
    const [resourceType, id] = reference.reference?.split('/') || [];
    if (!resourceType || !id) {
      throw new Error('Invalid reference format');
    }
    return this.httpClient.get<T>(`/${resourceType}/${id}`);
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    return this.httpClient.post<Patient>('/Patient', patient);
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    return this.httpClient.put<Patient>(`/Patient/${id}`, patient);
  }

  async createEncounter(encounter: Omit<Encounter, 'id'>): Promise<Encounter> {
    return this.httpClient.post<Encounter>('/Encounter', encounter);
  }

  async updateEncounter(
    id: string,
    encounter: Partial<Encounter>
  ): Promise<Encounter> {
    return this.httpClient.put<Encounter>(`/Encounter/${id}`, encounter);
  }

  async deletePatient(id: string): Promise<void> {
    return this.httpClient.delete(`/Patient/${id}`);
  }

  async deleteEncounter(id: string): Promise<void> {
    return this.httpClient.delete(`/Encounter/${id}`);
  }
}
