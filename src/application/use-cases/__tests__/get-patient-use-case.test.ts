import { GetPatientUseCaseImpl } from '../get-patient-use-case';
import { PatientRepository } from '@/domain/repositories/patient-repository';
import { Patient } from '@/domain/entities/patient';

describe('GetPatientUseCase', () => {
  let useCase: GetPatientUseCaseImpl;
  let mockPatientRepository: jest.Mocked<PatientRepository>;

  const mockPatient: Patient = {
    id: 'patient-1',
    resourceType: 'Patient',
    name: [{ family: 'Smith', given: ['John'] }],
    gender: 'male',
    birthDate: '1990-01-01',
  };

  beforeEach(() => {
    mockPatientRepository = {
      findById: jest.fn(),
      findByIdentifier: jest.fn(),
      findByDateRange: jest.fn(),
      findByStatus: jest.fn(),
      findByGender: jest.fn(),
      findByAgeRange: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByStatus: jest.fn(),
      countByGender: jest.fn(),
    } as jest.Mocked<PatientRepository>;

    useCase = new GetPatientUseCaseImpl(mockPatientRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return patient when repository returns data', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('patient-1');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-1');
    });

    it('should handle patient not found', async () => {
      mockPatientRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute('patient-1');

      expect(result).toBeNull();
      expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-1');
    });

    it('should handle repository errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockPatientRepository.findById.mockRejectedValue(error);

      await expect(useCase.execute('patient-1')).rejects.toThrow(
        'Failed to get patient: Database connection failed'
      );
    });

    it('should validate patient ID format', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('patient-123');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(
        'patient-123'
      );
    });

    it('should handle invalid patient ID characters', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('patient_123');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(
        'patient_123'
      );
    });

    it('should handle very long patient IDs', async () => {
      const longId = 'patient-' + 'a'.repeat(100);
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute(longId);

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(longId);
    });

    it('should handle special characters in patient ID', async () => {
      const specialId = 'patient-123!@#$%^&*()';
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute(specialId);

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(specialId);
    });
  });

  describe('validation', () => {
    it('should validate empty patient ID', async () => {
      await expect(useCase.execute('')).rejects.toThrow(
        'Patient ID is required'
      );
      expect(mockPatientRepository.findById).not.toHaveBeenCalled();
    });

    it('should validate null patient ID', async () => {
      await expect(useCase.execute(null as any)).rejects.toThrow(
        'Patient ID is required'
      );
      expect(mockPatientRepository.findById).not.toHaveBeenCalled();
    });

    it('should validate undefined patient ID', async () => {
      await expect(useCase.execute(undefined as any)).rejects.toThrow(
        'Patient ID is required'
      );
      expect(mockPatientRepository.findById).not.toHaveBeenCalled();
    });

    it('should validate patient ID with only whitespace', async () => {
      await expect(useCase.execute('   ')).rejects.toThrow(
        'Patient ID is required'
      );
      expect(mockPatientRepository.findById).not.toHaveBeenCalled();
    });

    it('should validate patient ID format', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('patient-123');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(
        'patient-123'
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      mockPatientRepository.findById.mockRejectedValue(networkError);

      await expect(useCase.execute('patient-1')).rejects.toThrow(
        'Failed to get patient: Network timeout'
      );
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockPatientRepository.findById.mockRejectedValue(timeoutError);

      await expect(useCase.execute('patient-1')).rejects.toThrow(
        'Failed to get patient: Request timeout'
      );
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection lost');
      mockPatientRepository.findById.mockRejectedValue(dbError);

      await expect(useCase.execute('patient-1')).rejects.toThrow(
        'Failed to get patient: Database connection lost'
      );
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Authentication failed');
      mockPatientRepository.findById.mockRejectedValue(authError);

      await expect(useCase.execute('patient-1')).rejects.toThrow(
        'Failed to get patient: Authentication failed'
      );
    });

    it('should handle authorization errors', async () => {
      const authzError = new Error('Access denied');
      mockPatientRepository.findById.mockRejectedValue(authzError);

      await expect(useCase.execute('patient-1')).rejects.toThrow(
        'Failed to get patient: Access denied'
      );
    });
  });

  describe('performance', () => {
    it('should handle patient retrieval efficiently', async () => {
      const startTime = Date.now();
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('patient-1');
      const endTime = Date.now();

      expect(result).toEqual(mockPatient);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle concurrent requests efficiently', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const promises = Array.from({ length: 10 }, (_, i) =>
        useCase.execute(`patient-${i}`)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toEqual(mockPatient);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle patient ID with leading/trailing spaces', async () => {
      const result = await useCase.execute('  patient-1  ');
      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-1');
    });

    it('should handle patient ID with mixed case', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('Patient-123');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(
        'Patient-123'
      );
    });

    it('should handle patient ID with numbers only', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('12345');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith('12345');
    });

    it('should handle patient ID with underscores and hyphens', async () => {
      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await useCase.execute('patient_123-456');

      expect(result).toEqual(mockPatient);
      expect(mockPatientRepository.findById).toHaveBeenCalledWith(
        'patient_123-456'
      );
    });
  });
});
