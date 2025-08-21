import { Patient } from '@/domain/entities/patient';
import { PatientRepository } from '@/domain/repositories/patient-repository';

export interface GetPatientUseCase {
  execute(id: string): Promise<Patient | null>;
}

export class GetPatientUseCaseImpl implements GetPatientUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(id: string): Promise<Patient | null> {
    if (!id || id.trim() === '') {
      throw new Error('Patient ID is required');
    }

    try {
      const patient = await this.patientRepository.findById(id);
      return patient;
    } catch (error) {
      throw new Error(
        `Failed to get patient: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
