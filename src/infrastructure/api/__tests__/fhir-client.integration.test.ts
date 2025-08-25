import { FhirClient } from '../fhir-client';
import { Patient } from '@/domain/entities/patient';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

const baseUrl = 'https://hapi.fhir.org/baseR4';
const fhirClient = new FhirClient(baseUrl);

describe('FhirClient Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch encounters successfully', async () => {
    const mockResponse = {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: Array.from({ length: 10 }, (_, i) => ({
        resource: {
          id: `encounter-${i + 1}`,
          resourceType: 'Encounter',
          status: 'finished',
          class: { code: 'AMB', display: 'Ambulatory' },
          subject: { reference: 'Patient/patient-1' },
          period: { start: '2024-01-01', end: '2024-01-01' },
        },
      })),
      total: 1000,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fhirClient.getEncounters({ _count: 10 });

    expect(result.resourceType).toBe('Bundle');
    expect(result.type).toBe('searchset');
    expect(result.entry).toHaveLength(10);
    expect(result.total).toBe(1000);
  });

  it('should handle query parameters correctly', async () => {
    const mockResponse = {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: Array.from({ length: 5 }, (_, i) => ({
        resource: {
          id: `encounter-${i + 1}`,
          resourceType: 'Encounter',
          status: 'in-progress',
          class: { code: 'AMB', display: 'Ambulatory' },
          subject: { reference: 'Patient/patient-1' },
          period: { start: '2024-01-01', end: '2024-01-01' },
        },
      })),
      total: 1000,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fhirClient.getEncounters({
      _count: 5,
      _page: 2,
      status: 'in-progress',
    });

    expect(result.entry).toHaveLength(5);
    result.entry?.forEach(entry => {
      expect(entry.resource.status).toBe('in-progress');
    });
  });

  it('should fetch patient by ID', async () => {
    const mockResponse = {
      resourceType: 'Patient',
      id: 'patient-1',
      name: [{ text: 'Patient patient-1' }],
      birthDate: '1990-01-01',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const patient = await fhirClient.getPatient('patient-1');

    expect(patient.resourceType).toBe('Patient');
    expect(patient.id).toBe('patient-1');
    expect(patient.name?.[0].text).toBe('Patient patient-1');
  });

  it('should fetch practitioner by ID', async () => {
    const mockResponse = {
      resourceType: 'Practitioner',
      id: 'practitioner-1',
      name: [{ text: 'Dr. practitioner-1' }],
      identifier: [{ value: 'PRAC001' }],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const practitioner = await fhirClient.getPractitioner('practitioner-1');

    expect(practitioner.resourceType).toBe('Practitioner');
    expect(practitioner.id).toBe('practitioner-1');
    expect(practitioner.name?.[0].text).toBe('Dr. practitioner-1');
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Internal Server Error' }),
    });

    await expect(fhirClient.getEncounters({})).rejects.toThrow('HTTP 500');
  });

  it('should resolve references correctly', async () => {
    const reference = { reference: 'Patient/patient-1' };
    const mockResponse = {
      resourceType: 'Patient',
      id: 'patient-1',
      name: [{ text: 'Patient patient-1' }],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const patient = await fhirClient.resolveReference<Patient>(reference);

    expect(patient.resourceType).toBe('Patient');
    expect(patient.id).toBe('patient-1');
  });
});
