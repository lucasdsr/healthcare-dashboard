import { EncounterRepository } from '../encounter-repository';
import { Encounter, EncounterStatus } from '@/domain/entities/encounter';

describe('EncounterRepository Interface', () => {
  let mockEncounterRepository: jest.Mocked<EncounterRepository>;

  beforeEach(() => {
    mockEncounterRepository = {
      findById: jest.fn(),
      findByPatient: jest.fn(),
      findByStatus: jest.fn(),
      findByDateRange: jest.fn(),
      search: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
  });

  describe('findById', () => {
    it('should find encounter by ID', async () => {
      const mockEncounter: Encounter = {
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

      mockEncounterRepository.findById.mockResolvedValue(mockEncounter);

      const result = await mockEncounterRepository.findById('encounter-1');

      expect(mockEncounterRepository.findById).toHaveBeenCalledWith(
        'encounter-1'
      );
      expect(result).toEqual(mockEncounter);
    });

    it('should return null when encounter not found', async () => {
      mockEncounterRepository.findById.mockResolvedValue(null);

      const result = await mockEncounterRepository.findById('non-existent');

      expect(mockEncounterRepository.findById).toHaveBeenCalledWith(
        'non-existent'
      );
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockEncounterRepository.findById.mockRejectedValue(error);

      await expect(
        mockEncounterRepository.findById('encounter-1')
      ).rejects.toThrow('Database connection failed');
      expect(mockEncounterRepository.findById).toHaveBeenCalledWith(
        'encounter-1'
      );
    });
  });

  describe('findByPatient', () => {
    it('should find encounters by patient ID', async () => {
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
        {
          id: 'encounter-2',
          resourceType: 'Encounter',
          status: 'in-progress',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'EMER',
            display: 'Emergency',
          },
          subject: {
            reference: 'Patient/patient-1',
            display: 'John Smith',
          },
        },
      ];

      mockEncounterRepository.findByPatient.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findByPatient('patient-1');

      expect(mockEncounterRepository.findByPatient).toHaveBeenCalledWith(
        'patient-1'
      );
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when patient has no encounters', async () => {
      mockEncounterRepository.findByPatient.mockResolvedValue([]);

      const result = await mockEncounterRepository.findByPatient(
        'patient-no-encounters'
      );

      expect(mockEncounterRepository.findByPatient).toHaveBeenCalledWith(
        'patient-no-encounters'
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle pagination for patient encounters', async () => {
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

      mockEncounterRepository.findByPatient.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findByPatient(
        'patient-1',
        0,
        1
      );

      expect(mockEncounterRepository.findByPatient).toHaveBeenCalledWith(
        'patient-1',
        0,
        1
      );
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(1);
    });
  });

  describe('findByStatus', () => {
    it('should find encounters by status', async () => {
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
        {
          id: 'encounter-2',
          resourceType: 'Encounter',
          status: 'in-progress',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'EMER',
            display: 'Emergency',
          },
          subject: {
            reference: 'Patient/patient-2',
            display: 'Jane Doe',
          },
        },
      ];

      mockEncounterRepository.findByStatus.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findByStatus('in-progress');

      expect(mockEncounterRepository.findByStatus).toHaveBeenCalledWith(
        'in-progress'
      );
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(2);
    });

    it('should handle all encounter statuses', async () => {
      const statuses: EncounterStatus[] = [
        'planned',
        'arrived',
        'triaged',
        'in-progress',
        'onleave',
        'finished',
        'cancelled',
        'entered-in-error',
        'unknown',
      ];

      statuses.forEach(async status => {
        const mockEncounters: Encounter[] = [
          {
            id: `encounter-${status}`,
            resourceType: 'Encounter',
            status,
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

        mockEncounterRepository.findByStatus.mockResolvedValue(mockEncounters);

        const result = await mockEncounterRepository.findByStatus(status);

        expect(mockEncounterRepository.findByStatus).toHaveBeenCalledWith(
          status
        );
        expect(result).toEqual(mockEncounters);
        expect(result[0].status).toBe(status);
      });
    });

    it('should return empty array when no encounters with status found', async () => {
      mockEncounterRepository.findByStatus.mockResolvedValue([]);

      const result = await mockEncounterRepository.findByStatus('finished');

      expect(mockEncounterRepository.findByStatus).toHaveBeenCalledWith(
        'finished'
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findByDateRange', () => {
    it('should find encounters within date range', async () => {
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
          period: {
            start: '2024-01-15T09:00:00Z',
            end: '2024-01-15T10:00:00Z',
          },
        },
      ];

      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-15T23:59:59Z');

      mockEncounterRepository.findByDateRange.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findByDateRange(
        startDate,
        endDate
      );

      expect(mockEncounterRepository.findByDateRange).toHaveBeenCalledWith(
        startDate,
        endDate
      );
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(1);
    });

    it('should handle date range with no encounters', async () => {
      const startDate = new Date('2024-01-01T00:00:00Z');
      const endDate = new Date('2024-01-01T23:59:59Z');

      mockEncounterRepository.findByDateRange.mockResolvedValue([]);

      const result = await mockEncounterRepository.findByDateRange(
        startDate,
        endDate
      );

      expect(mockEncounterRepository.findByDateRange).toHaveBeenCalledWith(
        startDate,
        endDate
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle single day range', async () => {
      const date = new Date('2024-01-15T00:00:00Z');
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
          period: {
            start: '2024-01-15T09:00:00Z',
            end: '2024-01-15T10:00:00Z',
          },
        },
      ];

      mockEncounterRepository.findByDateRange.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findByDateRange(date, date);

      expect(mockEncounterRepository.findByDateRange).toHaveBeenCalledWith(
        date,
        date
      );
      expect(result).toEqual(mockEncounters);
    });
  });

  describe('search', () => {
    it('should search encounters by multiple criteria', async () => {
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

      const searchCriteria = {
        status: 'in-progress',
        class: 'AMB',
        patientId: 'patient-1',
      };

      mockEncounterRepository.search.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.search(searchCriteria);

      expect(mockEncounterRepository.search).toHaveBeenCalledWith(
        searchCriteria
      );
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(1);
    });

    it('should search encounters by status only', async () => {
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

      mockEncounterRepository.search.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.search({
        status: 'finished',
      });

      expect(mockEncounterRepository.search).toHaveBeenCalledWith({
        status: 'finished',
      });
      expect(result).toEqual(mockEncounters);
    });

    it('should return empty array when no encounters match criteria', async () => {
      mockEncounterRepository.search.mockResolvedValue([]);

      const result = await mockEncounterRepository.search({
        status: 'planned',
        class: 'EMER',
      });

      expect(mockEncounterRepository.search).toHaveBeenCalledWith({
        status: 'planned',
        class: 'EMER',
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll', () => {
    it('should return all encounters with pagination', async () => {
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
        {
          id: 'encounter-2',
          resourceType: 'Encounter',
          status: 'in-progress',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'EMER',
            display: 'Emergency',
          },
          subject: {
            reference: 'Patient/patient-2',
            display: 'Jane Doe',
          },
        },
      ];

      mockEncounterRepository.findAll.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findAll(0, 10);

      expect(mockEncounterRepository.findAll).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(2);
    });

    it('should handle different page sizes', async () => {
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

      mockEncounterRepository.findAll.mockResolvedValue(mockEncounters);

      const result = await mockEncounterRepository.findAll(0, 1);

      expect(mockEncounterRepository.findAll).toHaveBeenCalledWith(0, 1);
      expect(result).toEqual(mockEncounters);
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no encounters on page', async () => {
      mockEncounterRepository.findAll.mockResolvedValue([]);

      const result = await mockEncounterRepository.findAll(100, 10);

      expect(mockEncounterRepository.findAll).toHaveBeenCalledWith(100, 10);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('save', () => {
    it('should save a new encounter', async () => {
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

      mockEncounterRepository.save.mockResolvedValue(newEncounter);

      const result = await mockEncounterRepository.save(newEncounter);

      expect(mockEncounterRepository.save).toHaveBeenCalledWith(newEncounter);
      expect(result).toEqual(newEncounter);
    });

    it('should handle save errors', async () => {
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

      const error = new Error('Validation failed');
      mockEncounterRepository.save.mockRejectedValue(error);

      await expect(mockEncounterRepository.save(newEncounter)).rejects.toThrow(
        'Validation failed'
      );
      expect(mockEncounterRepository.save).toHaveBeenCalledWith(newEncounter);
    });
  });

  describe('update', () => {
    it('should update an existing encounter', async () => {
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

      mockEncounterRepository.update.mockResolvedValue(updatedEncounter);

      const result = await mockEncounterRepository.update(
        'encounter-1',
        updatedEncounter
      );

      expect(mockEncounterRepository.update).toHaveBeenCalledWith(
        'encounter-1',
        updatedEncounter
      );
      expect(result).toEqual(updatedEncounter);
      expect(result.status).toBe('finished');
    });

    it('should handle update of non-existent encounter', async () => {
      const updatedEncounter: Encounter = {
        id: 'non-existent',
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
      mockEncounterRepository.update.mockRejectedValue(error);

      await expect(
        mockEncounterRepository.update('non-existent', updatedEncounter)
      ).rejects.toThrow('Encounter not found');
      expect(mockEncounterRepository.update).toHaveBeenCalledWith(
        'non-existent',
        updatedEncounter
      );
    });
  });

  describe('delete', () => {
    it('should delete an encounter', async () => {
      mockEncounterRepository.delete.mockResolvedValue(true);

      const result = await mockEncounterRepository.delete('encounter-1');

      expect(mockEncounterRepository.delete).toHaveBeenCalledWith(
        'encounter-1'
      );
      expect(result).toBe(true);
    });

    it('should handle deletion of non-existent encounter', async () => {
      mockEncounterRepository.delete.mockResolvedValue(false);

      const result = await mockEncounterRepository.delete('non-existent');

      expect(mockEncounterRepository.delete).toHaveBeenCalledWith(
        'non-existent'
      );
      expect(result).toBe(false);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Cannot delete encounter with active status');
      mockEncounterRepository.delete.mockRejectedValue(error);

      await expect(
        mockEncounterRepository.delete('encounter-1')
      ).rejects.toThrow('Cannot delete encounter with active status');
      expect(mockEncounterRepository.delete).toHaveBeenCalledWith(
        'encounter-1'
      );
    });
  });

  describe('count', () => {
    it('should return total encounter count', async () => {
      mockEncounterRepository.count.mockResolvedValue(250);

      const result = await mockEncounterRepository.count();

      expect(mockEncounterRepository.count).toHaveBeenCalled();
      expect(result).toBe(250);
    });

    it('should return zero when no encounters exist', async () => {
      mockEncounterRepository.count.mockResolvedValue(0);

      const result = await mockEncounterRepository.count();

      expect(mockEncounterRepository.count).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should handle count errors', async () => {
      const error = new Error('Database connection failed');
      mockEncounterRepository.count.mockRejectedValue(error);

      await expect(mockEncounterRepository.count()).rejects.toThrow(
        'Database connection failed'
      );
      expect(mockEncounterRepository.count).toHaveBeenCalled();
    });
  });

  describe('Repository Integration', () => {
    it('should perform complete CRUD operations', async () => {
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

      mockEncounterRepository.save.mockResolvedValue(newEncounter);
      mockEncounterRepository.findById.mockResolvedValue(newEncounter);
      mockEncounterRepository.update.mockResolvedValue({
        ...newEncounter,
        status: 'in-progress',
      });
      mockEncounterRepository.delete.mockResolvedValue(true);
      mockEncounterRepository.count.mockResolvedValue(1);

      const savedEncounter = await mockEncounterRepository.save(newEncounter);
      expect(savedEncounter).toEqual(newEncounter);

      const foundEncounter =
        await mockEncounterRepository.findById('test-encounter');
      expect(foundEncounter).toEqual(newEncounter);

      const updatedEncounter = await mockEncounterRepository.update(
        'test-encounter',
        { ...newEncounter, status: 'in-progress' }
      );
      expect(updatedEncounter.status).toBe('in-progress');

      const deleted = await mockEncounterRepository.delete('test-encounter');
      expect(deleted).toBe(true);

      const count = await mockEncounterRepository.count();
      expect(count).toBe(1);
    });
  });
});
