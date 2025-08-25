import { Patient } from '../patient';

describe('Patient Entity', () => {
  const mockPatient: Patient = {
    id: 'patient-1',
    resourceType: 'Patient',
    identifier: [
      {
        system: 'https://hospital.com/patients',
        value: 'P001',
      },
    ],
    name: [
      {
        use: 'official',
        family: 'Smith',
        given: ['John', 'Michael'],
      },
    ],
    telecom: [
      {
        system: 'phone',
        value: '+1-555-0123',
        use: 'home',
      },
      {
        system: 'email',
        value: 'john.smith@email.com',
        use: 'home',
      },
    ],
    gender: 'male',
    birthDate: '1990-05-15',
    address: [
      {
        use: 'home',
        type: 'physical',
        text: '123 Main St, Anytown, ST 12345',
        line: ['123 Main St'],
        city: 'Anytown',
        state: 'ST',
        postalCode: '12345',
        country: 'US',
      },
    ],
    contact: [
      {
        relationship: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                code: 'C',
                display: 'Emergency Contact',
              },
            ],
          },
        ],
        name: {
          use: 'official',
          family: 'Smith',
          given: ['Jane', 'Marie'],
        },
        telecom: [
          {
            system: 'phone',
            value: '+1-555-0456',
            use: 'mobile',
          },
        ],
      },
    ],
    managingOrganization: {
      reference: 'Organization/org-1',
      display: 'General Hospital',
    },
  };

  describe('Patient Properties', () => {
    it('should have required properties', () => {
      expect(mockPatient.id).toBe('patient-1');
      expect(mockPatient.resourceType).toBe('Patient');
      expect(mockPatient.gender).toBe('male');
      expect(mockPatient.birthDate).toBe('1990-05-15');
    });

    it('should have identifier array', () => {
      expect(mockPatient.identifier).toBeDefined();
      expect(Array.isArray(mockPatient.identifier)).toBe(true);
      expect(mockPatient.identifier).toHaveLength(1);
      expect(mockPatient.identifier![0].system).toBe(
        'https://hospital.com/patients'
      );
      expect(mockPatient.identifier![0].value).toBe('P001');
    });

    it('should have name array', () => {
      expect(mockPatient.name).toBeDefined();
      expect(Array.isArray(mockPatient.name)).toBe(true);
      expect(mockPatient.name).toHaveLength(1);
      expect(mockPatient.name![0].use).toBe('official');
      expect(mockPatient.name![0].family).toBe('Smith');
      expect(mockPatient.name![0].given).toEqual(['John', 'Michael']);
    });

    it('should have telecom array', () => {
      expect(mockPatient.telecom).toBeDefined();
      expect(Array.isArray(mockPatient.telecom)).toBe(true);
      expect(mockPatient.telecom).toHaveLength(2);

      const phoneContact = mockPatient.telecom!.find(t => t.system === 'phone');
      expect(phoneContact).toBeDefined();
      expect(phoneContact?.value).toBe('+1-555-0123');
      expect(phoneContact?.use).toBe('home');

      const emailContact = mockPatient.telecom!.find(t => t.system === 'email');
      expect(emailContact).toBeDefined();
      expect(emailContact?.value).toBe('john.smith@email.com');
      expect(emailContact?.use).toBe('home');
    });

    it('should have address array', () => {
      expect(mockPatient.address).toBeDefined();
      expect(Array.isArray(mockPatient.address)).toBe(true);
      expect(mockPatient.address).toHaveLength(1);

      const address = mockPatient.address![0];
      expect(address.use).toBe('home');
      expect(address.type).toBe('physical');
      expect(address.city).toBe('Anytown');
      expect(address.state).toBe('ST');
      expect(address.postalCode).toBe('12345');
      expect(address.country).toBe('US');
    });

    it('should have contact array', () => {
      expect(mockPatient.contact).toBeDefined();
      expect(Array.isArray(mockPatient.contact)).toBe(true);
      expect(mockPatient.contact).toHaveLength(1);

      const contact = mockPatient.contact![0];
      expect(contact.relationship).toBeDefined();
      expect(contact.relationship![0].coding![0].code).toBe('C');
      expect(contact.relationship![0].coding![0].display).toBe(
        'Emergency Contact'
      );
      expect(contact.name?.family).toBe('Smith');
      expect(contact.name?.given).toEqual(['Jane', 'Marie']);
    });

    it('should have managing organization', () => {
      expect(mockPatient.managingOrganization).toBeDefined();
      expect(mockPatient.managingOrganization!.reference).toBe(
        'Organization/org-1'
      );
      expect(mockPatient.managingOrganization!.display).toBe(
        'General Hospital'
      );
    });
  });

  describe('Patient Validation', () => {
    it('should handle patient with minimal required fields', () => {
      const minimalPatient: Patient = {
        id: 'patient-2',
        resourceType: 'Patient',
      };

      expect(minimalPatient.id).toBe('patient-2');
      expect(minimalPatient.resourceType).toBe('Patient');
    });

    it('should handle patient with all optional fields', () => {
      const fullPatient: Patient = {
        ...mockPatient,
        id: 'patient-3',
        deceasedBoolean: false,
        deceasedDateTime: undefined,
        multipleBirthBoolean: false,
        multipleBirthInteger: undefined,
        photo: [],
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: 'en',
                  display: 'English',
                },
              ],
            },
            preferred: true,
          },
        ],
      };

      expect(fullPatient.deceasedBoolean).toBe(false);
      expect(fullPatient.multipleBirthBoolean).toBe(false);
      expect(fullPatient.photo).toEqual([]);
      expect(fullPatient.communication).toHaveLength(1);
      expect(fullPatient.communication![0].language.coding![0].code).toBe('en');
    });

    it('should handle patient with different gender values', () => {
      const femalePatient: Patient = {
        ...mockPatient,
        id: 'patient-4',
        gender: 'female',
      };

      expect(femalePatient.gender).toBe('female');
    });

    it('should handle patient with different gender values', () => {
      const otherPatient: Patient = {
        ...mockPatient,
        id: 'patient-5',
        gender: 'other',
      };

      expect(otherPatient.gender).toBe('other');
    });

    it('should handle patient with unknown gender', () => {
      const unknownPatient: Patient = {
        ...mockPatient,
        id: 'patient-6',
        gender: 'unknown',
      };

      expect(unknownPatient.gender).toBe('unknown');
    });
  });

  describe('Patient Data Types', () => {
    it('should handle different identifier systems', () => {
      const patientWithMultipleIds: Patient = {
        ...mockPatient,
        id: 'patient-7',
        identifier: [
          {
            system: 'https://hospital.com/patients',
            value: 'P001',
          },
          {
            system: 'https://insurance.com/members',
            value: 'INS123456',
          },
          {
            system: 'https://pharmacy.com/customers',
            value: 'PHARM789',
          },
        ],
      };

      expect(patientWithMultipleIds.identifier).toHaveLength(3);
      expect(patientWithMultipleIds.identifier![1].system).toBe(
        'https://insurance.com/members'
      );
      expect(patientWithMultipleIds.identifier![2].value).toBe('PHARM789');
    });

    it('should handle multiple names', () => {
      const patientWithMultipleNames: Patient = {
        ...mockPatient,
        id: 'patient-8',
        name: [
          {
            use: 'official',
            family: 'Smith',
            given: ['John', 'Michael'],
          },
          {
            use: 'nickname',
            family: 'Smith',
            given: ['Johnny'],
          },
          {
            use: 'maiden',
            family: 'Johnson',
            given: ['John', 'Michael'],
          },
        ],
      };

      expect(patientWithMultipleNames.name).toHaveLength(3);
      expect(patientWithMultipleNames.name![1].use).toBe('nickname');
      expect(patientWithMultipleNames.name![1].given).toEqual(['Johnny']);
      expect(patientWithMultipleNames.name![2].use).toBe('maiden');
      expect(patientWithMultipleNames.name![2].family).toBe('Johnson');
    });

    it('should handle multiple addresses', () => {
      const patientWithMultipleAddresses: Patient = {
        ...mockPatient,
        id: 'patient-9',
        address: [
          {
            use: 'home',
            type: 'physical',
            line: ['123 Main St'],
            city: 'Anytown',
            state: 'ST',
            postalCode: '12345',
            country: 'US',
          },
          {
            use: 'work',
            type: 'physical',
            line: ['456 Business Ave'],
            city: 'Worktown',
            state: 'ST',
            postalCode: '67890',
            country: 'US',
          },
        ],
      };

      expect(patientWithMultipleAddresses.address).toHaveLength(2);
      expect(patientWithMultipleAddresses.address![0].use).toBe('home');
      expect(patientWithMultipleAddresses.address![1].use).toBe('work');
      expect(patientWithMultipleAddresses.address![1].city).toBe('Worktown');
    });
  });

  describe('Patient Edge Cases', () => {
    it('should handle patient with no identifiers', () => {
      const patientWithoutIds: Patient = {
        ...mockPatient,
        id: 'patient-10',
        identifier: [],
      };

      expect(patientWithoutIds.identifier).toEqual([]);
    });

    it('should handle patient with no names', () => {
      const patientWithoutNames: Patient = {
        ...mockPatient,
        id: 'patient-11',
        name: [],
      };

      expect(patientWithoutNames.name).toEqual([]);
    });

    it('should handle patient with no telecom', () => {
      const patientWithoutTelecom: Patient = {
        ...mockPatient,
        id: 'patient-12',
        telecom: [],
      };

      expect(patientWithoutTelecom.telecom).toEqual([]);
    });

    it('should handle patient with no addresses', () => {
      const patientWithoutAddresses: Patient = {
        ...mockPatient,
        id: 'patient-13',
        address: [],
      };

      expect(patientWithoutAddresses.address).toEqual([]);
    });

    it('should handle patient with no contacts', () => {
      const patientWithoutContacts: Patient = {
        ...mockPatient,
        id: 'patient-14',
        contact: [],
      };

      expect(patientWithoutContacts.contact).toEqual([]);
    });

    it('should handle patient with undefined optional fields', () => {
      const patientWithUndefinedFields: Patient = {
        id: 'patient-15',
        resourceType: 'Patient',
      };

      expect(patientWithUndefinedFields.identifier).toBeUndefined();
      expect(patientWithUndefinedFields.name).toBeUndefined();
      expect(patientWithUndefinedFields.gender).toBeUndefined();
      expect(patientWithUndefinedFields.birthDate).toBeUndefined();
      expect(patientWithUndefinedFields.address).toBeUndefined();
      expect(patientWithUndefinedFields.telecom).toBeUndefined();
    });
  });
});
