import { GetEncountersUseCaseImpl } from '../get-encounters-use-case';
import { EncounterRepository } from '@/domain/repositories/encounter-repository';
import { Encounter } from '@/domain/entities/encounter';

describe('GetEncountersUseCase', () => {
  let useCase: GetEncountersUseCaseImpl;
  let mockEncounterRepository: jest.Mocked<EncounterRepository>;

  const mockEncounter: Encounter = {
    id: 'encounter-1',
    resourceType: 'Encounter',
    status: 'finished',
    class: { code: 'AMB', display: 'Ambulatory' },
    subject: { reference: 'Patient/patient-1' },
  };

  beforeEach(() => {
    mockEncounterRepository = {
      findById: jest.fn(),
      findByPatientId: jest.fn(),
      findByStatus: jest.fn(),
      findByDateRange: jest.fn(),
      findByLocation: jest.fn(),
      findByServiceProvider: jest.fn(),
      findByType: jest.fn(),
      findActiveEncounters: jest.fn(),
      findPlannedEncounters: jest.fn(),
      findCompletedEncounters: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByStatus: jest.fn(),
      countByDateRange: jest.fn(),
      countByLocation: jest.fn(),
      getAverageEncounterDuration: jest.fn(),
      getEncountersByHour: jest.fn(),
      getEncountersByDay: jest.fn(),
    } as jest.Mocked<EncounterRepository>;

    useCase = new GetEncountersUseCaseImpl(mockEncounterRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return encounters when repository returns data', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'patient-1' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'patient-1'
      );
    });

    it('should handle no encounters found', async () => {
      mockEncounterRepository.findByPatientId.mockResolvedValue([]);

      const result = await useCase.execute({ patientId: 'patient-1' });

      expect(result).toEqual([]);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'patient-1'
      );
    });

    it('should handle repository errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockEncounterRepository.findByPatientId.mockRejectedValue(error);

      await expect(useCase.execute({ patientId: 'patient-1' })).rejects.toThrow(
        'Failed to get encounters: Database connection failed'
      );
    });

    it('should validate patient ID format', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'patient-123' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'patient-123'
      );
    });

    it('should handle invalid patient ID characters', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'patient_123' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'patient_123'
      );
    });

    it('should handle very long patient IDs', async () => {
      const longId = 'patient-' + 'a'.repeat(100);
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: longId });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        longId
      );
    });

    it('should handle special characters in patient ID', async () => {
      const specialId = 'patient-123!@#$%^&*()';
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: specialId });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        specialId
      );
    });

    it('should handle status filter', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByStatus.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ status: 'finished' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByStatus).toHaveBeenCalledWith(
        'finished'
      );
    });

    it('should handle location filter', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByLocation.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ locationId: 'location-1' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByLocation).toHaveBeenCalledWith(
        'location-1'
      );
    });

    it('should handle type filter', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByType.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ type: 'consultation' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByType).toHaveBeenCalledWith(
        'consultation'
      );
    });

    it('should return active encounters when no filters provided', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findActiveEncounters.mockResolvedValue(
        mockEncounters
      );

      const result = await useCase.execute();

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findActiveEncounters).toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    it('should handle empty patient ID', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findActiveEncounters.mockResolvedValue(
        mockEncounters
      );

      const result = await useCase.execute({ patientId: '' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findActiveEncounters).toHaveBeenCalled();
    });

    it('should handle null patient ID', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findActiveEncounters.mockResolvedValue(
        mockEncounters
      );

      const result = await useCase.execute({ patientId: null as any });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findActiveEncounters).toHaveBeenCalled();
    });

    it('should handle undefined patient ID', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findActiveEncounters.mockResolvedValue(
        mockEncounters
      );

      const result = await useCase.execute({ patientId: undefined });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findActiveEncounters).toHaveBeenCalled();
    });

    it('should handle patient ID with only whitespace', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: '   ' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        '   '
      );
    });

    it('should validate patient ID format', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'patient-123' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'patient-123'
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      mockEncounterRepository.findByPatientId.mockRejectedValue(networkError);

      await expect(useCase.execute({ patientId: 'patient-1' })).rejects.toThrow(
        'Failed to get encounters: Network timeout'
      );
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockEncounterRepository.findByPatientId.mockRejectedValue(timeoutError);

      await expect(useCase.execute({ patientId: 'patient-1' })).rejects.toThrow(
        'Failed to get encounters: Request timeout'
      );
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection lost');
      mockEncounterRepository.findByPatientId.mockRejectedValue(dbError);

      await expect(useCase.execute({ patientId: 'patient-1' })).rejects.toThrow(
        'Failed to get encounters: Database connection lost'
      );
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Authentication failed');
      mockEncounterRepository.findByPatientId.mockRejectedValue(authError);

      await expect(useCase.execute({ patientId: 'patient-1' })).rejects.toThrow(
        'Failed to get encounters: Authentication failed'
      );
    });

    it('should handle authorization errors', async () => {
      const authzError = new Error('Access denied');
      mockEncounterRepository.findByPatientId.mockRejectedValue(authzError);

      await expect(useCase.execute({ patientId: 'patient-1' })).rejects.toThrow(
        'Failed to get encounters: Access denied'
      );
    });
  });

  describe('performance', () => {
    it('should handle encounter retrieval efficiently', async () => {
      const startTime = Date.now();
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'patient-1' });
      const endTime = Date.now();

      expect(result).toEqual(mockEncounters);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle concurrent requests efficiently', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const promises = Array.from({ length: 10 }, (_, i) =>
        useCase.execute({ patientId: `patient-${i}` })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toEqual(mockEncounters);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle patient ID with leading/trailing spaces', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: '  patient-1  ' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        '  patient-1  '
      );
    });

    it('should handle patient ID with mixed case', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'Patient-123' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'Patient-123'
      );
    });

    it('should handle patient ID with numbers only', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: '12345' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        '12345'
      );
    });

    it('should handle patient ID with underscores and hyphens', async () => {
      const mockEncounters = [mockEncounter];
      mockEncounterRepository.findByPatientId.mockResolvedValue(mockEncounters);

      const result = await useCase.execute({ patientId: 'patient_123-456' });

      expect(result).toEqual(mockEncounters);
      expect(mockEncounterRepository.findByPatientId).toHaveBeenCalledWith(
        'patient_123-456'
      );
    });
  });
});
