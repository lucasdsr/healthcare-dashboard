import { PatientRepository } from '../patient-repository';
import { Patient } from '@/domain/entities/patient';

describe('PatientRepository Interface', () => {
  let mockPatientRepository: jest.Mocked<PatientRepository>;

  beforeEach(() => {
    mockPatientRepository = {
      findById: jest.fn(),
      findByIdentifier: jest.fn(),
      search: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    };
  });

  describe('findById', () => {
    it('should find patient by ID', async () => {
      const mockPatient: Patient = {
        id: 'patient-1',
        resourceType: 'Patient',
        identifier: [
          {
            system: 'https://hospital.com/patients',
            value: 'P001'
          }
        ],
        name: [
          {
            use: 'official',
            family: 'Smith',
            given: ['John', 'Michael']
          }
        ],
        gender: 'male',
        birthDate: '1990-05-15'
      };

      mockPatientRepository.findById.mockResolvedValue(mockPatient);

      const result = await mockPatientRepository.findById('patient-1');

      expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-1');
      expect(result).toEqual(mockPatient);
    });

    it('should return null when patient not found', async () => {
      mockPatientRepository.findById.mockResolvedValue(null);

      const result = await mockPatientRepository.findById('non-existent');

      expect(mockPatientRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockPatientRepository.findById.mockRejectedValue(error);

      await expect(mockPatientRepository.findById('patient-1')).rejects.toThrow('Database connection failed');
      expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-1');
    });
  });

  describe('findByIdentifier', () => {
    it('should find patient by identifier', async () => {
      const mockPatient: Patient = {
        id: 'patient-1',
        resourceType: 'Patient',
        identifier: [
          {
            system: 'https://hospital.com/patients',
            value: 'P001'
          }
        ],
        name: [
          {
            use: 'official',
            family: 'Smith',
            given: ['John', 'Michael']
          }
        ],
        gender: 'male',
        birthDate: '1990-05-15'
      };

      mockPatientRepository.findByIdentifier.mockResolvedValue(mockPatient);

      const result = await mockPatientRepository.findByIdentifier('https://hospital.com/patients', 'P001');

      expect(mockPatientRepository.findByIdentifier).toHaveBeenCalledWith('https://hospital.com/patients', 'P001');
      expect(result).toEqual(mockPatient);
    });

    it('should return null when patient not found by identifier', async () => {
      mockPatientRepository.findByIdentifier.mockResolvedValue(null);

      const result = await mockPatientRepository.findByIdentifier('https://hospital.com/patients', 'NONEXISTENT');

      expect(mockPatientRepository.findByIdentifier).toHaveBeenCalledWith('https://hospital.com/patients', 'NONEXISTENT');
      expect(result).toBeNull();
    });

    it('should handle different identifier systems', async () => {
      const mockPatient: Patient = {
        id: 'patient-2',
        resourceType: 'Patient',
        identifier: [
          {
            system: 'https://insurance.com/members',
            value: 'INS123456'
          }
        ],
        name: [
          {
            use: 'official',
            family: 'Johnson',
            given: ['Jane']
          }
        ],
        gender: 'female'
      };

      mockPatientRepository.findByIdentifier.mockResolvedValue(mockPatient);

      const result = await mockPatientRepository.findByIdentifier('https://insurance.com/members', 'INS123456');

      expect(mockPatientRepository.findByIdentifier).toHaveBeenCalledWith('https://insurance.com/members', 'INS123456');
      expect(result).toEqual(mockPatient);
    });
  });

  describe('search', () => {
    it('should search patients by name', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John']
            }
          ]
        },
        {
          id: 'patient-2',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['Jane']
            }
          ]
        }
      ];

      mockPatientRepository.search.mockResolvedValue(mockPatients);

      const result = await mockPatientRepository.search({ name: 'Smith' });

      expect(mockPatientRepository.search).toHaveBeenCalledWith({ name: 'Smith' });
      expect(result).toEqual(mockPatients);
      expect(result).toHaveLength(2);
    });

    it('should search patients by multiple criteria', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John']
            }
          ],
          gender: 'male',
          birthDate: '1990-05-15'
        }
      ];

      mockPatientRepository.search.mockResolvedValue(mockPatients);

      const searchCriteria = {
        name: 'Smith',
        gender: 'male',
        birthDate: '1990-05-15'
      };

      const result = await mockPatientRepository.search(searchCriteria);

      expect(mockPatientRepository.search).toHaveBeenCalledWith(searchCriteria);
      expect(result).toEqual(mockPatients);
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no patients found', async () => {
      mockPatientRepository.search.mockResolvedValue([]);

      const result = await mockPatientRepository.search({ name: 'NonExistent' });

      expect(mockPatientRepository.search).toHaveBeenCalledWith({ name: 'NonExistent' });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle search with no criteria', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John']
            }
          ]
        }
      ];

      mockPatientRepository.search.mockResolvedValue(mockPatients);

      const result = await mockPatientRepository.search({});

      expect(mockPatientRepository.search).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPatients);
    });
  });

  describe('findAll', () => {
    it('should return all patients with pagination', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John']
            }
          ]
        },
        {
          id: 'patient-2',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Johnson',
              given: ['Jane']
            }
          ]
        }
      ];

      mockPatientRepository.findAll.mockResolvedValue(mockPatients);

      const result = await mockPatientRepository.findAll(0, 10);

      expect(mockPatientRepository.findAll).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual(mockPatients);
      expect(result).toHaveLength(2);
    });

    it('should handle different page sizes', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-1',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Smith',
              given: ['John']
            }
          ]
        }
      ];

      mockPatientRepository.findAll.mockResolvedValue(mockPatients);

      const result = await mockPatientRepository.findAll(0, 1);

      expect(mockPatientRepository.findAll).toHaveBeenCalledWith(0, 1);
      expect(result).toEqual(mockPatients);
      expect(result).toHaveLength(1);
    });

    it('should handle second page', async () => {
      const mockPatients: Patient[] = [
        {
          id: 'patient-3',
          resourceType: 'Patient',
          name: [
            {
              use: 'official',
              family: 'Brown',
              given: ['Bob']
            }
          ]
        }
      ];

      mockPatientRepository.findAll.mockResolvedValue(mockPatients);

      const result = await mockPatientRepository.findAll(10, 10);

      expect(mockPatientRepository.findAll).toHaveBeenCalledWith(10, 10);
      expect(result).toEqual(mockPatients);
    });

    it('should return empty array when no patients on page', async () => {
      mockPatientRepository.findAll.mockResolvedValue([]);

      const result = await mockPatientRepository.findAll(100, 10);

      expect(mockPatientRepository.findAll).toHaveBeenCalledWith(100, 10);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('save', () => {
    it('should save a new patient', async () => {
      const newPatient: Patient = {
        id: 'new-patient',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Wilson',
            given: ['Alice']
          }
        ],
        gender: 'female'
      };

      mockPatientRepository.save.mockResolvedValue(newPatient);

      const result = await mockPatientRepository.save(newPatient);

      expect(mockPatientRepository.save).toHaveBeenCalledWith(newPatient);
      expect(result).toEqual(newPatient);
    });

    it('should handle save errors', async () => {
      const newPatient: Patient = {
        id: 'new-patient',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Wilson',
            given: ['Alice']
          }
        ],
        gender: 'female'
      };

      const error = new Error('Validation failed');
      mockPatientRepository.save.mockRejectedValue(error);

      await expect(mockPatientRepository.save(newPatient)).rejects.toThrow('Validation failed');
      expect(mockPatientRepository.save).toHaveBeenCalledWith(newPatient);
    });
  });

  describe('update', () => {
    it('should update an existing patient', async () => {
      const updatedPatient: Patient = {
        id: 'patient-1',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Smith-Jones',
            given: ['John', 'Michael']
          }
        ],
        gender: 'male',
        birthDate: '1990-05-15'
      };

      mockPatientRepository.update.mockResolvedValue(updatedPatient);

      const result = await mockPatientRepository.update('patient-1', updatedPatient);

      expect(mockPatientRepository.update).toHaveBeenCalledWith('patient-1', updatedPatient);
      expect(result).toEqual(updatedPatient);
    });

    it('should handle update of non-existent patient', async () => {
      const updatedPatient: Patient = {
        id: 'non-existent',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'NonExistent',
            given: ['John']
          }
        ]
      };

      const error = new Error('Patient not found');
      mockPatientRepository.update.mockRejectedValue(error);

      await expect(mockPatientRepository.update('non-existent', updatedPatient)).rejects.toThrow('Patient not found');
      expect(mockPatientRepository.update).toHaveBeenCalledWith('non-existent', updatedPatient);
    });
  });

  describe('delete', () => {
    it('should delete a patient', async () => {
      mockPatientRepository.delete.mockResolvedValue(true);

      const result = await mockPatientRepository.delete('patient-1');

      expect(mockPatientRepository.delete).toHaveBeenCalledWith('patient-1');
      expect(result).toBe(true);
    });

    it('should handle deletion of non-existent patient', async () => {
      mockPatientRepository.delete.mockResolvedValue(false);

      const result = await mockPatientRepository.delete('non-existent');

      expect(mockPatientRepository.delete).toHaveBeenCalledWith('non-existent');
      expect(result).toBe(false);
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Cannot delete patient with active encounters');
      mockPatientRepository.delete.mockRejectedValue(error);

      await expect(mockPatientRepository.delete('patient-1')).rejects.toThrow('Cannot delete patient with active encounters');
      expect(mockPatientRepository.delete).toHaveBeenCalledWith('patient-1');
    });
  });

  describe('count', () => {
    it('should return total patient count', async () => {
      mockPatientRepository.count.mockResolvedValue(150);

      const result = await mockPatientRepository.count();

      expect(mockPatientRepository.count).toHaveBeenCalled();
      expect(result).toBe(150);
    });

    it('should return zero when no patients exist', async () => {
      mockPatientRepository.count.mockResolvedValue(0);

      const result = await mockPatientRepository.count();

      expect(mockPatientRepository.count).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should handle count errors', async () => {
      const error = new Error('Database connection failed');
      mockPatientRepository.count.mockRejectedValue(error);

      await expect(mockPatientRepository.count()).rejects.toThrow('Database connection failed');
      expect(mockPatientRepository.count).toHaveBeenCalled();
    });
  });

  describe('Repository Integration', () => {
    it('should perform complete CRUD operations', async () => {
      const newPatient: Patient = {
        id: 'test-patient',
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: 'Test',
            given: ['User']
          }
        ],
        gender: 'other'
      };

      mockPatientRepository.save.mockResolvedValue(newPatient);
      mockPatientRepository.findById.mockResolvedValue(newPatient);
      mockPatientRepository.update.mockResolvedValue({ ...newPatient, gender: 'male' });
      mockPatientRepository.delete.mockResolvedValue(true);
      mockPatientRepository.count.mockResolvedValue(1);

      const savedPatient = await mockPatientRepository.save(newPatient);
      expect(savedPatient).toEqual(newPatient);

      const foundPatient = await mockPatientRepository.findById('test-patient');
      expect(foundPatient).toEqual(newPatient);

      const updatedPatient = await mockPatientRepository.update('test-patient', { ...newPatient, gender: 'male' });
      expect(updatedPatient.gender).toBe('male');

      const deleted = await mockPatientRepository.delete('test-patient');
      expect(deleted).toBe(true);

      const count = await mockPatientRepository.count();
      expect(count).toBe(1);
    });
  });
});
