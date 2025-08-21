import { Encounter, EncounterStatus } from '@/domain/entities/encounter';
import { EncounterRepository } from '@/domain/repositories/encounter-repository';
import { DateRange } from '@/domain/value-objects/date-range';

export interface GetEncountersUseCase {
  execute(filters?: EncounterFilters): Promise<Encounter[]>;
}

export interface EncounterFilters {
  patientId?: string;
  status?: EncounterStatus;
  dateRange?: DateRange;
  locationId?: string;
  serviceProviderId?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export class GetEncountersUseCaseImpl implements GetEncountersUseCase {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async execute(filters?: EncounterFilters): Promise<Encounter[]> {
    try {
      if (filters?.patientId) {
        return await this.encounterRepository.findByPatientId(
          filters.patientId
        );
      }

      if (filters?.status) {
        return await this.encounterRepository.findByStatus(filters.status);
      }

      if (filters?.dateRange) {
        return await this.encounterRepository.findByDateRange(
          filters.dateRange
        );
      }

      if (filters?.locationId) {
        return await this.encounterRepository.findByLocation(
          filters.locationId
        );
      }

      if (filters?.serviceProviderId) {
        return await this.encounterRepository.findByServiceProvider(
          filters.serviceProviderId
        );
      }

      if (filters?.type) {
        return await this.encounterRepository.findByType(filters.type);
      }

      return await this.encounterRepository.findActiveEncounters();
    } catch (error) {
      throw new Error(
        `Failed to get encounters: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
