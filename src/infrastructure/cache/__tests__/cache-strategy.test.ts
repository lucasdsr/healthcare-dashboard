import { CACHE_STRATEGIES, getCacheStrategy } from '../cache-strategy';

describe('Cache Strategy', () => {
  describe('CACHE_STRATEGIES', () => {
    it('should have correct strategies for encounters', () => {
      const encounterStrategy = CACHE_STRATEGIES.encounters;
      expect(encounterStrategy.ttl).toBe(5 * 60 * 1000); // 5 minutes
      expect(encounterStrategy.maxSize).toBe(1000);
      expect(encounterStrategy.priority).toBe('high');
    });

    it('should have correct strategies for patients', () => {
      const patientStrategy = CACHE_STRATEGIES.patients;
      expect(patientStrategy.ttl).toBe(30 * 60 * 1000); // 30 minutes
      expect(patientStrategy.maxSize).toBe(5000);
      expect(patientStrategy.priority).toBe('high');
    });

    it('should have correct strategies for practitioners', () => {
      const practitionerStrategy = CACHE_STRATEGIES.practitioners;
      expect(practitionerStrategy.ttl).toBe(60 * 60 * 1000); // 1 hour
      expect(practitionerStrategy.maxSize).toBe(1000);
      expect(practitionerStrategy.priority).toBe('medium');
    });

    it('should have correct strategies for organizations', () => {
      const organizationStrategy = CACHE_STRATEGIES.organizations;
      expect(organizationStrategy.ttl).toBe(24 * 60 * 60 * 1000); // 24 hours
      expect(organizationStrategy.maxSize).toBe(100);
      expect(organizationStrategy.priority).toBe('low');
    });
  });

  describe('getCacheStrategy', () => {
    it('should return correct strategy for known resource types', () => {
      const encounterStrategy = getCacheStrategy('encounters');
      expect(encounterStrategy.priority).toBe('high');
      expect(encounterStrategy.ttl).toBe(5 * 60 * 1000);
    });

    it('should return default strategy for unknown resource types', () => {
      const unknownStrategy = getCacheStrategy('unknown-resource');
      expect(unknownStrategy.priority).toBe('medium');
      expect(unknownStrategy.ttl).toBe(15 * 60 * 1000); // 15 minutes default
      expect(unknownStrategy.maxSize).toBe(1000);
    });

    it('should handle empty string resource type', () => {
      const emptyStrategy = getCacheStrategy('');
      expect(emptyStrategy.priority).toBe('medium');
      expect(emptyStrategy.ttl).toBe(15 * 60 * 1000);
    });
  });
});
