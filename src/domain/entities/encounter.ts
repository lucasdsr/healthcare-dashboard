import {
  BaseEntity,
  CodeableConcept,
  Reference,
  Period,
  EncounterParticipant,
} from '@/shared/types/fhir';

export interface Encounter extends BaseEntity {
  resourceType: 'Encounter';
  status: EncounterStatus;
  class: {
    system?: string;
    code?: string;
    display?: string;
  };
  type?: CodeableConcept[];
  subject: Reference;
  participant?: EncounterParticipant[];
  period?: Period;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  diagnosis?: Array<{
    condition: Reference;
    use?: CodeableConcept;
    rank?: number;
  }>;
  account?: Reference[];
  hospitalization?: {
    preAdmissionIdentifier?: {
      system?: string;
      value?: string;
    };
    origin?: Reference;
    admitSource?: CodeableConcept;
    reAdmission?: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
      text?: string;
    };
    dietPreference?: CodeableConcept[];
    specialCourtesy?: CodeableConcept[];
    specialArrangement?: CodeableConcept[];
    destination?: Reference;
    dischargeDisposition?: CodeableConcept;
  };
  location?: Array<{
    location: Reference;
    status?: 'planned' | 'active' | 'reserved' | 'completed';
    physicalType?: CodeableConcept;
    period?: Period;
  }>;
  serviceProvider?: Reference;
  partOf?: Reference;
}

export type EncounterStatus =
  | 'planned'
  | 'arrived'
  | 'triaged'
  | 'in-progress'
  | 'onleave'
  | 'finished'
  | 'cancelled'
  | 'entered-in-error'
  | 'unknown';
