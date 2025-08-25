import { FHIRService } from '../fhir-service';
import { Patient } from '@/domain/entities/patient';
import { Encounter } from '@/domain/entities/encounter';
import { DashboardMetrics } from '../fhir-service';

describe('FHIRService', () => {
  let fhirService: FHIRService;
  let mockHttpClient: jest.Mocked<any>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    fhirService = new FHIRService(mockHttpClient);
  });

  describe('getPatient', () => {
    it('should fetch patient by ID', async () => {
      const mockPatient: Patient = {
        id: 'patient-1',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Smith',
            given: ['John', 'Michael'],
          },
        ],
        gender: 'male',
        birthDate: '1990-05-15',
      };

      mockHttpClient.get.mockResolvedValue({ data: mockPatient });

      const result = await fhirService.getPatient('patient-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient/patient-1');
      expect(result).toEqual(mockPatient);
    });

    it('should handle patient not found', async () => {
      mockHttpClient.get.mockResolvedValue({ data: null });

      const result = await fhirService.getPatient('non-existent');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient/non-existent');
      expect(result).toBeNull();
    });

    it('should handle HTTP errors', async () => {
      const error = new Error('Patient not found');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(fhirService.getPatient('patient-1')).rejects.toThrow(
        'Patient not found'
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient/patient-1');
    });
  });

  describe('getEncounters', () => {
    it('should fetch encounters with filters', async () => {
      const mockEncounters: Encounter[] = [
        {
          id: 'encounter-1',
          resourceType: 'Encounter',
          status: 'finished',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'Ambulatory',
          },
          subject: {
            reference: 'Patient/patient-1',
            display: 'John Smith',
          },
        },
      ];

      const filters = {
        patientId: 'patient-1',
        status: 'finished',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      mockHttpClient.get.mockResolvedValue({ data: { entry: mockEncounters } });

      const result = await fhirService.getEncounters(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Encounter', {
        params: filters,
      });
      expect(result).toEqual(mockEncounters);
    });

    it('should fetch encounters without filters', async () => {
      const mockEncounters: Encounter[] = [
        {
          id: 'encounter-1',
          resourceType: 'Encounter',
          status: 'in-progress',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'Ambulatory',
          },
          subject: {
            reference: 'Patient/patient-1',
            display: 'John Smith',
          },
        },
      ];

      mockHttpClient.get.mockResolvedValue({ data: { entry: mockEncounters } });

      const result = await fhirService.getEncounters({});

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Encounter', {
        params: {},
      });
      expect(result).toEqual(mockEncounters);
    });

    it('should handle empty encounter list', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { entry: [] } });

      const result = await fhirService.getEncounters({});

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Encounter', {
        params: {},
      });
      expect(result).toEqual([]);
    });

    it('should handle HTTP errors', async () => {
      const error = new Error('Failed to fetch encounters');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(fhirService.getEncounters({})).rejects.toThrow(
        'Failed to fetch encounters'
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith('/Encounter', {
        params: {},
      });
    });
  });

  describe('getDashboardMetrics', () => {
    it('should fetch dashboard metrics', async () => {
      const mockMetrics: DashboardMetrics = {
        totalEncounters: 150,
        activeEncounters: 25,
        dailyAverage: 5.2,
        encountersByStatus: {
          'in-progress': 15,
          finished: 120,
          planned: 10,
          cancelled: 5,
        },
        encountersByDate: {
          '2024-01-15': 8,
          '2024-01-16': 6,
          '2024-01-17': 4,
        },
      };

      mockHttpClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await fhirService.getDashboardMetrics();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/dashboard/metrics');
      expect(result).toEqual(mockMetrics);
    });

    it('should handle metrics with filters', async () => {
      const mockMetrics: DashboardMetrics = {
        totalEncounters: 50,
        activeEncounters: 10,
        dailyAverage: 3.3,
        encountersByStatus: {
          'in-progress': 8,
          finished: 35,
          planned: 5,
          cancelled: 2,
        },
        encountersByDate: {
          '2024-01-15': 5,
          '2024-01-16': 3,
        },
      };

      const filters = {
        startDate: '2024-01-15',
        endDate: '2024-01-16',
      };

      mockHttpClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await fhirService.getDashboardMetrics(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/dashboard/metrics', {
        params: filters,
      });
      expect(result).toEqual(mockMetrics);
    });

    it('should handle empty metrics', async () => {
      const mockMetrics: DashboardMetrics = {
        totalEncounters: 0,
        activeEncounters: 0,
        dailyAverage: 0,
        encountersByStatus: {},
        encountersByDate: {},
      };

      mockHttpClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await fhirService.getDashboardMetrics();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/dashboard/metrics');
      expect(result).toEqual(mockMetrics);
      expect(result.totalEncounters).toBe(0);
      expect(result.activeEncounters).toBe(0);
    });

    it('should handle HTTP errors', async () => {
      const error = new Error('Failed to fetch metrics');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(fhirService.getDashboardMetrics()).rejects.toThrow(
        'Failed to fetch metrics'
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith('/dashboard/metrics');
    });
  });

  describe('searchPatients', () => {
    it('should search patients by name', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John'],
            },
          ],
          gender: 'male',
        },
        {
          id: 'patient-2',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['Jane'],
            },
          ],
          gender: 'female',
        },
      ];

      const searchParams = {
        name: 'Smith',
        gender: 'male',
      };

      mockHttpClient.get.mockResolvedValue({ data: { entry: mockPatients } });

      const result = await fhirService.searchPatients(searchParams);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient', {
        params: searchParams,
      });
      expect(result).toEqual(mockPatients);
      expect(result).toHaveLength(2);
    });

    it('should search patients without parameters', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John'],
            },
          ],
        },
      ];

      mockHttpClient.get.mockResolvedValue({ data: { entry: mockPatients } });

      const result = await fhirService.searchPatients({});

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient', {
        params: {},
      });
      expect(result).toEqual(mockPatients);
    });

    it('should handle no search results', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { entry: [] } });

      const result = await fhirService.searchPatients({ name: 'NonExistent' });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient', {
        params: { name: 'NonExistent' },
      });
      expect(result).toEqual([]);
    });

    it('should handle search errors', async () => {
      const error = new Error('Search failed');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(
        fhirService.searchPatients({ name: 'Smith' })
      ).rejects.toThrow('Search failed');
      expect(mockHttpClient.get).toHaveBeenCalledWith('/Patient', {
        params: { name: 'Smith' },
      });
    });
  });

  describe('createPatient', () => {
    it('should create a new patient', async () => {
      const newPatient: Patient = {
        id: 'new-patient',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Wilson',
            given: ['Alice'],
          },
        ],
        gender: 'female',
      };

      const createdPatient = { ...newPatient, id: 'generated-id' };

      mockHttpClient.post.mockResolvedValue({ data: createdPatient });

      const result = await fhirService.createPatient(newPatient);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Patient', newPatient);
      expect(result).toEqual(createdPatient);
    });

    it('should handle creation errors', async () => {
      const newPatient: Patient = {
        id: 'new-patient',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Wilson',
            given: ['Alice'],
          },
        ],
      };

      const error = new Error('Validation failed');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(fhirService.createPatient(newPatient)).rejects.toThrow(
        'Validation failed'
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith('/Patient', newPatient);
    });
  });

  describe('updatePatient', () => {
    it('should update an existing patient', async () => {
      const updatedPatient: Patient = {
        id: 'patient-1',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Smith-Jones',
            given: ['John', 'Michael'],
          },
        ],
        gender: 'male',
      };

      mockHttpClient.put.mockResolvedValue({ data: updatedPatient });

      const result = await fhirService.updatePatient(
        'patient-1',
        updatedPatient
      );

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/Patient/patient-1',
        updatedPatient
      );
      expect(result).toEqual(updatedPatient);
    });

    it('should handle update errors', async () => {
      const updatedPatient: Patient = {
        id: 'patient-1',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Smith',
            given: ['John'],
          },
        ],
      };

      const error = new Error('Patient not found');
      mockHttpClient.put.mockRejectedValue(error);

      await expect(
        fhirService.updatePatient('patient-1', updatedPatient)
      ).rejects.toThrow('Patient not found');
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/Patient/patient-1',
        updatedPatient
      );
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient', async () => {
      mockHttpClient.delete.mockResolvedValue({ data: { success: true } });

      const result = await fhirService.deletePatient('patient-1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/Patient/patient-1');
      expect(result).toEqual({ success: true });
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Cannot delete patient with active encounters');
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(fhirService.deletePatient('patient-1')).rejects.toThrow(
        'Cannot delete patient with active encounters'
      );
      expect(mockHttpClient.delete).toHaveBeenCalledWith('/Patient/patient-1');
    });
  });

  describe('createEncounter', () => {
    it('should create a new encounter', async () => {
      const newEncounter: Encounter = {
        id: 'new-encounter',
        resourceType: 'Encounter',
        status: 'planned',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-1',
          display: 'John Smith',
        },
      };

      const createdEncounter = { ...newEncounter, id: 'generated-id' };

      mockHttpClient.post.mockResolvedValue({ data: createdEncounter });

      const result = await fhirService.createEncounter(newEncounter);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/Encounter',
        newEncounter
      );
      expect(result).toEqual(createdEncounter);
    });

    it('should handle encounter creation errors', async () => {
      const newEncounter: Encounter = {
        id: 'new-encounter',
        resourceType: 'Encounter',
        status: 'planned',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-1',
          display: 'John Smith',
        },
      };

      const error = new Error('Invalid encounter data');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(fhirService.createEncounter(newEncounter)).rejects.toThrow(
        'Invalid encounter data'
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/Encounter',
        newEncounter
      );
    });
  });

  describe('updateEncounter', () => {
    it('should update an existing encounter', async () => {
      const updatedEncounter: Encounter = {
        id: 'encounter-1',
        resourceType: 'Encounter',
        status: 'in-progress',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-1',
          display: 'John Smith',
        },
      };

      mockHttpClient.put.mockResolvedValue({ data: updatedEncounter });

      const result = await fhirService.updateEncounter(
        'encounter-1',
        updatedEncounter
      );

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/Encounter/encounter-1',
        updatedEncounter
      );
      expect(result).toEqual(updatedEncounter);
    });

    it('should handle encounter update errors', async () => {
      const updatedEncounter: Encounter = {
        id: 'encounter-1',
        resourceType: 'Encounter',
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-1',
          display: 'John Smith',
        },
      };

      const error = new Error('Encounter not found');
      mockHttpClient.put.mockRejectedValue(error);

      await expect(
        fhirService.updateEncounter('encounter-1', updatedEncounter)
      ).rejects.toThrow('Encounter not found');
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/Encounter/encounter-1',
        updatedEncounter
      );
    });
  });

  describe('deleteEncounter', () => {
    it('should delete an encounter', async () => {
      mockHttpClient.delete.mockResolvedValue({ data: { success: true } });

      const result = await fhirService.deleteEncounter('encounter-1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        '/Encounter/encounter-1'
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle encounter deletion errors', async () => {
      const error = new Error('Cannot delete active encounter');
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(fhirService.deleteEncounter('encounter-1')).rejects.toThrow(
        'Cannot delete active encounter'
      );
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        '/Encounter/encounter-1'
      );
    });
  });

  describe('Service Integration', () => {
    it('should perform complete patient lifecycle', async () => {
      const newPatient: Patient = {
        id: 'test-patient',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Test',
            given: ['User'],
          },
        ],
        gender: 'other',
      };

      const createdPatient = { ...newPatient, id: 'generated-id' };
      const updatedPatient = { ...createdPatient, gender: 'male' };

      mockHttpClient.post.mockResolvedValue({ data: createdPatient });
      mockHttpClient.get.mockResolvedValue({ data: createdPatient });
      mockHttpClient.put.mockResolvedValue({ data: updatedPatient });
      mockHttpClient.delete.mockResolvedValue({ data: { success: true } });

      const savedPatient = await fhirService.createPatient(newPatient);
      expect(savedPatient).toEqual(createdPatient);

      const foundPatient = await fhirService.getPatient('generated-id');
      expect(foundPatient).toEqual(createdPatient);

      const modifiedPatient = await fhirService.updatePatient(
        'generated-id',
        updatedPatient
      );
      expect(modifiedPatient.gender).toBe('male');

      const deleted = await fhirService.deletePatient('generated-id');
      expect(deleted.success).toBe(true);
    });

    it('should perform complete encounter lifecycle', async () => {
      const newEncounter: Encounter = {
        id: 'test-encounter',
        resourceType: 'Encounter',
        status: 'planned',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-1',
          display: 'Test Patient',
        },
      };

      const createdEncounter = { ...newEncounter, id: 'generated-id' };
      const updatedEncounter = { ...createdEncounter, status: 'in-progress' };

      mockHttpClient.post.mockResolvedValue({ data: createdEncounter });
      mockHttpClient.get.mockResolvedValue({
        data: { entry: [createdEncounter] },
      });
      mockHttpClient.put.mockResolvedValue({ data: updatedEncounter });
      mockHttpClient.delete.mockResolvedValue({ data: { success: true } });

      const savedEncounter = await fhirService.createEncounter(newEncounter);
      expect(savedEncounter).toEqual(createdEncounter);

      const foundEncounters = await fhirService.getEncounters({});
      expect(foundEncounters).toEqual([createdEncounter]);

      const modifiedEncounter = await fhirService.updateEncounter(
        'generated-id',
        updatedEncounter
      );
      expect(modifiedEncounter.status).toBe('in-progress');

      const deleted = await fhirService.deleteEncounter('generated-id');
      expect(deleted.success).toBe(true);
    });
  });
});
