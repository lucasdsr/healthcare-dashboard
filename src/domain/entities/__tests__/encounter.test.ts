import { Encounter, EncounterStatus } from '../encounter';

describe('Encounter Entity', () => {
  const mockEncounter: Encounter = {
    id: 'encounter-1',
    resourceType: 'Encounter',
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'Ambulatory',
    },
    subject: {
      reference: 'Patient/patient-1',
      display: 'John Smith',
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/encounter-participant-type',
                code: 'ATND',
                display: 'Attending',
              },
            ],
          },
        ],
        individual: {
          reference: 'Practitioner/practitioner-1',
          display: 'Dr. Sarah Johnson',
        },
      },
    ],
    period: {
      start: '2024-01-15T09:00:00Z',
      end: '2024-01-15T10:30:00Z',
    },
    reasonCode: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '2470005',
            display: 'Patient visit',
          },
        ],
        text: 'Annual checkup',
      },
    ],
    diagnosis: [
      {
        condition: {
          reference: 'Condition/condition-1',
          display: 'Hypertension',
        },
        use: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/diagnosis-role',
              code: 'AD',
              display: 'Admission diagnosis',
            },
          ],
        },
      },
    ],
    serviceProvider: {
      reference: 'Organization/org-1',
      display: 'General Hospital',
    },
  };

  describe('Encounter Properties', () => {
    it('should have required properties', () => {
      expect(mockEncounter.id).toBe('encounter-1');
      expect(mockEncounter.resourceType).toBe('Encounter');
      expect(mockEncounter.status).toBe('in-progress');
    });

    it('should have class information', () => {
      expect(mockEncounter.class).toBeDefined();
      expect(mockEncounter.class!.system).toBe(
        'http://terminology.hl7.org/CodeSystem/v3-ActCode'
      );
      expect(mockEncounter.class!.code).toBe('AMB');
      expect(mockEncounter.class!.display).toBe('Ambulatory');
    });

    it('should have subject reference', () => {
      expect(mockEncounter.subject).toBeDefined();
      expect(mockEncounter.subject!.reference).toBe('Patient/patient-1');
      expect(mockEncounter.subject!.display).toBe('John Smith');
    });

    it('should have participant array', () => {
      expect(mockEncounter.participant).toBeDefined();
      expect(Array.isArray(mockEncounter.participant)).toBe(true);
      expect(mockEncounter.participant).toHaveLength(1);

      const participant = mockEncounter.participant![0];
      expect(participant.type![0].coding![0].code).toBe('ATND');
      expect(participant.type![0].coding![0].display).toBe('Attending');
      expect(participant.individual!.reference).toBe(
        'Practitioner/practitioner-1'
      );
      expect(participant.individual!.display).toBe('Dr. Sarah Johnson');
    });

    it('should have period information', () => {
      expect(mockEncounter.period).toBeDefined();
      expect(mockEncounter.period!.start).toBe('2024-01-15T09:00:00Z');
      expect(mockEncounter.period!.end).toBe('2024-01-15T10:30:00Z');
    });

    it('should have reason codes', () => {
      expect(mockEncounter.reasonCode).toBeDefined();
      expect(Array.isArray(mockEncounter.reasonCode)).toBe(true);
      expect(mockEncounter.reasonCode).toHaveLength(1);

      const reasonCode = mockEncounter.reasonCode![0];
      expect(reasonCode.coding![0].code).toBe('2470005');
      expect(reasonCode.coding![0].display).toBe('Patient visit');
      expect(reasonCode.text).toBe('Annual checkup');
    });

    it('should have diagnosis array', () => {
      expect(mockEncounter.diagnosis).toBeDefined();
      expect(Array.isArray(mockEncounter.diagnosis)).toBe(true);
      expect(mockEncounter.diagnosis).toHaveLength(1);

      const diagnosis = mockEncounter.diagnosis![0];
      expect(diagnosis.condition!.reference).toBe('Condition/condition-1');
      expect(diagnosis.condition!.display).toBe('Hypertension');
      expect(diagnosis.use!.coding![0].code).toBe('AD');
      expect(diagnosis.use!.coding![0].display).toBe('Admission diagnosis');
    });

    it('should have service provider', () => {
      expect(mockEncounter.serviceProvider).toBeDefined();
      expect(mockEncounter.serviceProvider!.reference).toBe(
        'Organization/org-1'
      );
      expect(mockEncounter.serviceProvider!.display).toBe('General Hospital');
    });
  });

  describe('Encounter Status Values', () => {
    it('should support all valid encounter statuses', () => {
      const statuses: EncounterStatus[] = [
        'planned',
        'arrived',
        'triaged',
        'in-progress',
        'onleave',
        'finished',
        'cancelled',
        'entered-in-error',
        'unknown',
      ];

      statuses.forEach(status => {
        const encounter: Encounter = {
          ...mockEncounter,
          id: `encounter-${status}`,
          status,
        };
        expect(encounter.status).toBe(status);
      });
    });

    it('should handle planned encounter', () => {
      const plannedEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-planned',
        status: 'planned',
      };
      expect(plannedEncounter.status).toBe('planned');
    });

    it('should handle arrived encounter', () => {
      const arrivedEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-arrived',
        status: 'arrived',
      };
      expect(arrivedEncounter.status).toBe('arrived');
    });

    it('should handle triaged encounter', () => {
      const triagedEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-triaged',
        status: 'triaged',
      };
      expect(triagedEncounter.status).toBe('triaged');
    });

    it('should handle onleave encounter', () => {
      const onleaveEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-onleave',
        status: 'onleave',
      };
      expect(onleaveEncounter.status).toBe('onleave');
    });

    it('should handle finished encounter', () => {
      const finishedEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-finished',
        status: 'finished',
      };
      expect(finishedEncounter.status).toBe('finished');
    });

    it('should handle cancelled encounter', () => {
      const cancelledEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-cancelled',
        status: 'cancelled',
      };
      expect(cancelledEncounter.status).toBe('cancelled');
    });

    it('should handle entered-in-error encounter', () => {
      const errorEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-error',
        status: 'entered-in-error',
      };
      expect(errorEncounter.status).toBe('entered-in-error');
    });

    it('should handle unknown encounter', () => {
      const unknownEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-unknown',
        status: 'unknown',
      };
      expect(unknownEncounter.status).toBe('unknown');
    });
  });

  describe('Encounter Class Types', () => {
    it('should handle different encounter class types', () => {
      const classTypes = [
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

      classTypes.forEach((classType, index) => {
        const encounter: Encounter = {
          ...mockEncounter,
          id: `encounter-class-${index}`,
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: classType.code,
            display: classType.display,
          },
        };
        expect(encounter.class!.code).toBe(classType.code);
        expect(encounter.class!.display).toBe(classType.display);
      });
    });
  });

  describe('Encounter Validation', () => {
    it('should handle encounter with minimal required fields', () => {
      const minimalEncounter: Encounter = {
        id: 'encounter-minimal',
        resourceType: 'Encounter',
        status: 'planned',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-minimal',
          display: 'Minimal Patient',
        },
      };

      expect(minimalEncounter.id).toBe('encounter-minimal');
      expect(minimalEncounter.resourceType).toBe('Encounter');
      expect(minimalEncounter.status).toBe('planned');
      expect(minimalEncounter.class!.code).toBe('AMB');
    });

    it('should handle encounter with all optional fields', () => {
      const fullEncounter: Encounter = {
        ...mockEncounter,
        id: 'encounter-full',
        hospitalization: {
          admitSource: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/admit-source',
                code: 'PH',
                display: 'Physician Referral',
              },
            ],
          },
          dischargeDisposition: {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/discharge-disposition',
                code: 'HOME',
                display: 'Home',
              },
            ],
          },
        },
        location: [
          {
            location: {
              reference: 'Location/location-1',
              display: 'Emergency Department',
            },
            status: 'active',
            period: {
              start: '2024-01-15T09:00:00Z',
            },
          },
        ],
      };

      expect(fullEncounter.hospitalization!.admitSource!.coding![0].code).toBe(
        'PH'
      );
      expect(fullEncounter.location![0].location!.display).toBe(
        'Emergency Department'
      );
    });
  });

  describe('Encounter Edge Cases', () => {
    it('should handle encounter with no participants', () => {
      const encounterWithoutParticipants: Encounter = {
        ...mockEncounter,
        id: 'encounter-no-participants',
        participant: [],
      };

      expect(encounterWithoutParticipants.participant).toEqual([]);
    });

    it('should handle encounter with no reason codes', () => {
      const encounterWithoutReasons: Encounter = {
        ...mockEncounter,
        id: 'encounter-no-reasons',
        reasonCode: [],
      };

      expect(encounterWithoutReasons.reasonCode).toEqual([]);
    });

    it('should handle encounter with no diagnosis', () => {
      const encounterWithoutDiagnosis: Encounter = {
        ...mockEncounter,
        id: 'encounter-no-diagnosis',
        diagnosis: [],
      };

      expect(encounterWithoutDiagnosis.diagnosis).toEqual([]);
    });

    it('should handle encounter with undefined optional fields', () => {
      const encounterWithUndefinedFields: Encounter = {
        id: 'encounter-undefined',
        resourceType: 'Encounter',
        status: 'planned',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory',
        },
        subject: {
          reference: 'Patient/patient-undefined',
          display: 'Undefined Patient',
        },
      };

      expect(encounterWithUndefinedFields.participant).toBeUndefined();
      expect(encounterWithUndefinedFields.period).toBeUndefined();
      expect(encounterWithUndefinedFields.reasonCode).toBeUndefined();
      expect(encounterWithUndefinedFields.diagnosis).toBeUndefined();
      expect(encounterWithUndefinedFields.serviceProvider).toBeUndefined();
    });

    it('should handle encounter with multiple participants', () => {
      const encounterWithMultipleParticipants: Encounter = {
        ...mockEncounter,
        id: 'encounter-multiple-participants',
        participant: [
          {
            type: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/encounter-participant-type',
                    code: 'ATND',
                    display: 'Attending',
                  },
                ],
              },
            ],
            individual: {
              reference: 'Practitioner/practitioner-1',
              display: 'Dr. Sarah Johnson',
            },
          },
          {
            type: [
              {
                coding: [
                  {
                    system:
                      'http://terminology.hl7.org/CodeSystem/encounter-participant-type',
                    code: 'CON',
                    display: 'Consultant',
                  },
                ],
              },
            ],
            individual: {
              reference: 'Practitioner/practitioner-2',
              display: 'Dr. Michael Brown',
            },
          },
        ],
      };

      expect(encounterWithMultipleParticipants.participant).toHaveLength(2);
      expect(
        encounterWithMultipleParticipants.participant![0].type![0].coding![0]
          .code
      ).toBe('ATND');
      expect(
        encounterWithMultipleParticipants.participant![1].type![0].coding![0]
          .code
      ).toBe('CON');
    });
  });
});
