import {
  BaseEntity,
  Identifier,
  HumanName,
  Address,
  ContactPoint,
} from '@/shared/types/fhir';

export interface Patient extends BaseEntity {
  resourceType: 'Patient';
  identifier?: Identifier[];
  name?: HumanName[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: Address[];
  telecom?: ContactPoint[];
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  maritalStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: Array<{
    contentType?: string;
    language?: string;
    data?: string;
    url?: string;
    size?: number;
    hash?: string;
    title?: string;
  }>;
  contact?: Array<{
    relationship?: Array<{
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
      text?: string;
    }>;
    name?: HumanName;
    telecom?: ContactPoint[];
    address?: Address;
    gender?: 'male' | 'female' | 'other' | 'unknown';
    organization?: {
      reference?: string;
      display?: string;
    };
    period?: {
      start?: string;
      end?: string;
    };
  }>;
  communication?: Array<{
    language: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
      text?: string;
    };
    preferred?: boolean;
  }>;
  generalPractitioner?: Array<{
    reference?: string;
    display?: string;
  }>;
  managingOrganization?: {
    reference?: string;
    display?: string;
  };
  link?: Array<{
    other: {
      reference?: string;
      display?: string;
    };
    type: 'replaced-by' | 'replaces' | 'refer' | 'seealso';
  }>;
}
