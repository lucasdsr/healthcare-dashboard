export const HEALTHCARE_CONSTANTS = {
  STATUS_COLORS: {
    planned: 'bg-blue-100 text-blue-800 border-blue-200',
    arrived: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    triaged: 'bg-orange-100 text-orange-800 border-orange-200',
    'in-progress': 'bg-green-100 text-green-800 border-green-200',
    onleave: 'bg-purple-100 text-purple-800 border-purple-200',
    finished: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    'entered-in-error': 'bg-red-100 text-red-800 border-red-200',
    unknown: 'bg-gray-100 text-gray-800 border-gray-200',
  },

  GENDER_OPTIONS: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' },
  ],

  ENCOUNTER_CLASSES: [
    { code: 'AMB', display: 'Ambulatory' },
    { code: 'EMER', display: 'Emergency' },
    { code: 'FLD', display: 'Field' },
    { code: 'HH', display: 'Home Health' },
    { code: 'IMP', display: 'Inpatient Encounter' },
    { code: 'ACUTE', display: 'Inpatient Acute' },
    { code: 'NONAC', display: 'Inpatient Non-acute' },
    { code: 'OBSENC', display: 'Observation Encounter' },
    { code: 'PRENC', display: 'Pre-admission' },
    { code: 'SS', display: 'Short Stay' },
    { code: 'VR', display: 'Virtual' },
  ],

  ENCOUNTER_TYPES: [
    { code: 'ADMS', display: 'Admission' },
    { code: 'ATND', display: 'Attendance' },
    { code: 'CALL', display: 'Call' },
    { code: 'DISCH', display: 'Discharge' },
    { code: 'EMER', display: 'Emergency' },
    { code: 'FLD', display: 'Field' },
    { code: 'HH', display: 'Home Health' },
    { code: 'IMP', display: 'Inpatient' },
    { code: 'OBSENC', display: 'Observation' },
    { code: 'PRENC', display: 'Pre-admission' },
    { code: 'SS', display: 'Short Stay' },
    { code: 'VR', display: 'Virtual' },
  ],

  PRIORITY_LEVELS: [
    { value: 1, label: 'Immediate', color: 'bg-red-500' },
    { value: 2, label: 'High', color: 'bg-orange-500' },
    { value: 3, label: 'Medium', color: 'bg-yellow-500' },
    { value: 4, label: 'Low', color: 'bg-green-500' },
    { value: 5, label: 'Routine', color: 'bg-blue-500' },
  ],

  TIME_INTERVALS: {
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
  },

  CACHE_TTL: {
    SHORT: 5 * 60 * 1000,
    MEDIUM: 15 * 60 * 1000,
    LONG: 60 * 60 * 1000,
    VERY_LONG: 24 * 60 * 60 * 1000,
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_IDENTIFIER_LENGTH: 3,
    MAX_IDENTIFIER_LENGTH: 50,
    MIN_AGE: 0,
    MAX_AGE: 150,
  },
} as const;

export const API_ENDPOINTS = {
  FHIR_BASE:
    process.env.NEXT_PUBLIC_FHIR_BASE_URL || 'http://localhost:8080/fhir',
  PATIENTS: '/Patient',
  ENCOUNTERS: '/Encounter',
  ORGANIZATIONS: '/Organization',
  LOCATIONS: '/Location',
  PRACTITIONERS: '/Practitioner',
} as const;

export const ERROR_MESSAGES = {
  PATIENT_NOT_FOUND: 'Patient not found',
  ENCOUNTER_NOT_FOUND: 'Encounter not found',
  INVALID_ID: 'Invalid ID provided',
  NETWORK_ERROR: 'Network error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
} as const;
