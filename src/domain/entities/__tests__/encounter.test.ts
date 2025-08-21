import { Encounter, EncounterStatus } from '../encounter';
import { Patient } from '../patient';
import { Practitioner } from '../practitioner';
import { Organization } from '../organization';

describe('Encounter Entity', () => {
  const mockPatient: Patient = {
    id: 'patient-1',
    resourceType: 'Patient',
    name: [{ text: 'John Doe' }],
  };

  const mockPractitioner: Practitioner = {
    id: 'practitioner-1',
    resourceType: 'Practitioner',
    name: [{ text: 'Dr. Smith' }],
  };

  const mockOrganization: Organization = {
    id: 'org-1',
    resourceType: 'Organization',
    name: 'General Hospital',
  };

  it('should create a valid encounter', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'in-progress',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
      participant: [
        {
          individual: { reference: 'Practitioner/practitioner-1' },
          type: [{ code: 'ATND', display: 'Attending' }],
        },
      ],
      period: {
        start: '2024-01-01T10:00:00Z',
        end: '2024-01-01T11:00:00Z',
      },
      serviceProvider: { reference: 'Organization/org-1' },
    };

    expect(encounter.resourceType).toBe('Encounter');
    expect(encounter.status).toBe('in-progress');
    expect(encounter.subject.reference).toBe('Patient/patient-1');
  });

  it('should validate encounter status', () => {
    const validStatuses: EncounterStatus[] = [
      'planned',
      'arrived',
      'triaged',
      'in-progress',
      'onleave',
      'finished',
      'cancelled',
    ];

    validStatuses.forEach(status => {
      const encounter: Encounter = {
        id: 'encounter-1',
        resourceType: 'Encounter',
        status,
        class: { code: 'AMB', display: 'Ambulatory' },
        subject: { reference: 'Patient/patient-1' },
      };

      expect(encounter.status).toBe(status);
    });
  });

  it('should handle missing optional fields', () => {
    const minimalEncounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'planned',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
    };

    expect(minimalEncounter.period).toBeUndefined();
    expect(minimalEncounter.participant).toBeUndefined();
    expect(minimalEncounter.serviceProvider).toBeUndefined();
  });

  it('should handle encounter with multiple participants', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'in-progress',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
      participant: [
        {
          individual: { reference: 'Practitioner/practitioner-1' },
          type: [{ code: 'ATND', display: 'Attending' }],
        },
        {
          individual: { reference: 'Practitioner/practitioner-2' },
          type: [{ code: 'CON', display: 'Consultant' }],
        },
      ],
    };

    expect(encounter.participant).toHaveLength(2);
    expect(encounter.participant?.[0].type?.[0].code).toBe('ATND');
    expect(encounter.participant?.[1].type?.[0].code).toBe('CON');
  });

  it('should handle encounter with different class types', () => {
    const encounterClasses = [
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
    ];

    encounterClasses.forEach(encounterClass => {
      const encounter: Encounter = {
        id: 'encounter-1',
        resourceType: 'Encounter',
        status: 'planned',
        class: encounterClass,
        subject: { reference: 'Patient/patient-1' },
      };

      expect(encounter.class.code).toBe(encounterClass.code);
      expect(encounter.class.display).toBe(encounterClass.display);
    });
  });

  it('should handle encounter with different periods', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'finished',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
      period: {
        start: '2024-01-01T09:00:00Z',
        end: '2024-01-01T17:00:00Z',
      },
    };

    expect(encounter.period?.start).toBe('2024-01-01T09:00:00Z');
    expect(encounter.period?.end).toBe('2024-01-01T17:00:00Z');
  });

  it('should handle encounter with reason codes', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'in-progress',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
      reasonCode: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '185389000',
              display: 'Follow-up visit',
            },
          ],
        },
      ],
    };

    expect(encounter.reasonCode).toHaveLength(1);
    expect(encounter.reasonCode?.[0].coding?.[0].code).toBe('185389000');
    expect(encounter.reasonCode?.[0].coding?.[0].display).toBe(
      'Follow-up visit'
    );
  });

  it('should handle encounter with diagnosis', () => {
    const encounter: Encounter = {
      id: 'encounter-1',
      resourceType: 'Encounter',
      status: 'finished',
      class: { code: 'AMB', display: 'Ambulatory' },
      subject: { reference: 'Patient/patient-1' },
      diagnosis: [
        {
          condition: { reference: 'Condition/condition-1' },
          rank: 1,
        },
      ],
    };

    expect(encounter.diagnosis).toHaveLength(1);
    expect(encounter.diagnosis?.[0].condition.reference).toBe(
      'Condition/condition-1'
    );
    expect(encounter.diagnosis?.[0].rank).toBe(1);
  });
});
