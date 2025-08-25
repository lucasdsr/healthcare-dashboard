export const API_CONFIG = {
  FHIR_BASE_URL:
    process.env.NEXT_PUBLIC_FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4',
  FHIR_API_KEY: process.env.NEXT_PUBLIC_FHIR_API_KEY,
  REQUEST_TIMEOUT: 30000,
  CACHE_TTL: 5 * 60 * 1000,
} as const;

export const FHIR_ENDPOINTS = {
  PATIENT: '/Patient',
  ENCOUNTER: '/Encounter',
  PRACTITIONER: '/Practitioner',
  ORGANIZATION: '/Organization',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 1000,
} as const;
