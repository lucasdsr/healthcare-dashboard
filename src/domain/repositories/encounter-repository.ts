import { Encounter, EncounterStatus } from '@/domain/entities/encounter';
import { DateRange } from '@/domain/value-objects/date-range';

export interface EncounterRepository {
  findById(id: string): Promise<Encounter | null>;
  findByPatientId(patientId: string): Promise<Encounter[]>;
  findByStatus(status: EncounterStatus): Promise<Encounter[]>;
  findByDateRange(dateRange: DateRange): Promise<Encounter[]>;
  findByLocation(locationId: string): Promise<Encounter[]>;
  findByServiceProvider(serviceProviderId: string): Promise<Encounter[]>;
  findByType(type: string): Promise<Encounter[]>;
  findActiveEncounters(): Promise<Encounter[]>;
  findPlannedEncounters(): Promise<Encounter[]>;
  findCompletedEncounters(): Promise<Encounter[]>;
  search(query: string): Promise<Encounter[]>;
  create(encounter: Omit<Encounter, 'id'>): Promise<Encounter>;
  update(id: string, encounter: Partial<Encounter>): Promise<Encounter>;
  updateStatus(id: string, status: EncounterStatus): Promise<Encounter>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  countByStatus(status: EncounterStatus): Promise<number>;
  countByDateRange(dateRange: DateRange): Promise<number>;
  countByLocation(locationId: string): Promise<number>;
  getAverageEncounterDuration(): Promise<number>;
  getEncountersByHour(): Promise<Array<{ hour: number; count: number }>>;
  getEncountersByDay(): Promise<Array<{ date: string; count: number }>>;
}
