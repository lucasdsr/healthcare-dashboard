import { Patient } from '@/domain/entities/patient';
import { DateRange } from '@/domain/value-objects/date-range';

export interface PatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByIdentifier(identifier: string): Promise<Patient | null>;
  findByDateRange(dateRange: DateRange): Promise<Patient[]>;
  findByStatus(status: string): Promise<Patient[]>;
  findByGender(
    gender: 'male' | 'female' | 'other' | 'unknown'
  ): Promise<Patient[]>;
  findByAgeRange(minAge: number, maxAge: number): Promise<Patient[]>;
  search(query: string): Promise<Patient[]>;
  create(patient: Omit<Patient, 'id'>): Promise<Patient>;
  update(id: string, patient: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  countByStatus(status: string): Promise<number>;
  countByGender(
    gender: 'male' | 'female' | 'other' | 'unknown'
  ): Promise<number>;
}
