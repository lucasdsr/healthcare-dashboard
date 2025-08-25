import { InMemoryCacheService } from '../cache-service';

describe('InMemoryCacheService', () => {
  let cacheService: InMemoryCacheService;

  beforeEach(() => {
    cacheService = new InMemoryCacheService();
  });

  describe('set and get', () => {
    it('should set and get a value', async () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      await cacheService.set(key, value);
      const result = await cacheService.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const result = await cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should overwrite existing value', async () => {
      const key = 'test-key';
      const value1 = { data: 'first' };
      const value2 = { data: 'second' };

      await cacheService.set(key, value1);
      await cacheService.set(key, value2);

      const result = await cacheService.get(key);
      expect(result).toEqual(value2);
    });

    it('should handle different data types', async () => {
      const stringValue = 'test string';
      const numberValue = 42;
      const booleanValue = true;
      const objectValue = { key: 'value' };
      const arrayValue = [1, 2, 3];

      await cacheService.set('string', stringValue);
      await cacheService.set('number', numberValue);
      await cacheService.set('boolean', booleanValue);
      await cacheService.set('object', objectValue);
      await cacheService.set('array', arrayValue);

      expect(await cacheService.get('string')).toBe(stringValue);
      expect(await cacheService.get('number')).toBe(numberValue);
      expect(await cacheService.get('boolean')).toBe(booleanValue);
      expect(await cacheService.get('object')).toEqual(objectValue);
      expect(await cacheService.get('array')).toEqual(arrayValue);
    });
  });

  describe('has', () => {
    it('should return true for existing key', async () => {
      const key = 'test-key';
      await cacheService.set(key, 'value');

      expect(await cacheService.has(key)).toBe(true);
    });

    it('should return false for non-existent key', async () => {
      expect(await cacheService.has('non-existent')).toBe(false);
    });

    it('should return false after deletion', async () => {
      const key = 'test-key';
      await cacheService.set(key, 'value');
      await cacheService.delete(key);

      expect(await cacheService.has(key)).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete existing key', async () => {
      const key = 'test-key';
      await cacheService.set(key, 'value');

      await cacheService.delete(key);
      expect(await cacheService.has(key)).toBe(false);
    });

    it('should handle multiple deletions', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');

      await cacheService.delete('key1');
      await cacheService.delete('key2');
      expect(await cacheService.has('key1')).toBe(false);
      expect(await cacheService.has('key2')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all entries', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.set('key3', 'value3');

      await cacheService.clear();

      expect(await cacheService.has('key1')).toBe(false);
      expect(await cacheService.has('key2')).toBe(false);
      expect(await cacheService.has('key3')).toBe(false);
    });

    it('should handle clear on empty cache', async () => {
      await expect(cacheService.clear()).resolves.not.toThrow();
    });
  });

  describe('getKeys', () => {
    it('should return empty array for empty cache', async () => {
      const keys = await cacheService.getKeys();
      expect(keys).toEqual([]);
    });

    it('should return all keys', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.set('key3', 'value3');

      const keys = await cacheService.getKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys).toHaveLength(3);
    });

    it('should return updated keys after modifications', async () => {
      await cacheService.set('key1', 'value1');
      expect(await cacheService.getKeys()).toEqual(['key1']);

      await cacheService.set('key2', 'value2');
      const keys = await cacheService.getKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');

      await cacheService.delete('key1');
      const updatedKeys = await cacheService.getKeys();
      expect(updatedKeys).not.toContain('key1');
      expect(updatedKeys).toContain('key2');
    });
  });

  describe('getStats', () => {
    it('should return stats with size and hitRate', () => {
      const stats = cacheService.getStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('hitRate');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.hitRate).toBe('number');
    });

    it('should return correct size for empty cache', () => {
      const stats = cacheService.getStats();
      expect(stats.size).toBe(0);
    });

    it('should return correct size for populated cache', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.set('key3', 'value3');

      const stats = cacheService.getStats();
      expect(stats.size).toBe(3);
    });
  });

  describe('TTL functionality', () => {
    it('should expire values after TTL', async () => {
      const key = 'expiring-key';
      const value = { data: 'test-data' };
      const shortTTL = 10; // 10ms

      await cacheService.set(key, value, shortTTL);

      const resultBeforeExpiry = await cacheService.get(key);
      expect(resultBeforeExpiry).toEqual(value);

      await new Promise(resolve => setTimeout(resolve, shortTTL + 10));

      const resultAfterExpiry = await cacheService.get(key);
      expect(resultAfterExpiry).toBeNull();
    });

    it('should not expire values before TTL', async () => {
      const key = 'non-expiring-key';
      const value = { data: 'test-data' };
      const longTTL = 1000; // 1 second

      await cacheService.set(key, value, longTTL);

      const result = await cacheService.get(key);
      expect(result).toEqual(value);
    });

    it('should use default TTL when not specified', async () => {
      const key = 'default-ttl-key';
      const value = { data: 'test-data' };

      await cacheService.set(key, value);

      const result = await cacheService.get(key);
      expect(result).toEqual(value);
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined values', async () => {
      await cacheService.set('null', null);
      await cacheService.set('undefined', undefined);

      expect(await cacheService.get('null')).toBeNull();
      expect(await cacheService.get('undefined')).toBeUndefined();
    });

    it('should handle empty string keys', async () => {
      await cacheService.set('', 'empty-key-value');
      expect(await cacheService.get('')).toBe('empty-key-value');
      expect(await cacheService.has('')).toBe(true);
    });

    it('should handle special characters in keys', async () => {
      const specialKey = 'key-with-special-chars!@#$%^&*()';
      await cacheService.set(specialKey, 'special-value');

      expect(await cacheService.get(specialKey)).toBe('special-value');
      expect(await cacheService.has(specialKey)).toBe(true);
    });

    it('should handle large number of entries', async () => {
      const entries = 100;
      for (let i = 0; i < entries; i++) {
        await cacheService.set(`key${i}`, `value${i}`);
      }

      const keys = await cacheService.getKeys();
      expect(keys).toHaveLength(entries);
      expect(await cacheService.get('key0')).toBe('value0');
      expect(await cacheService.get('key99')).toBe('value99');
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent set operations', async () => {
      const operations = 10;
      const promises = Array.from({ length: operations }, (_, i) =>
        cacheService.set(`key${i}`, `value${i}`)
      );

      await Promise.all(promises);

      const keys = await cacheService.getKeys();
      expect(keys).toHaveLength(operations);
    });

    it('should handle concurrent get operations', async () => {
      await cacheService.set('test-key', 'test-value');

      const operations = 10;
      const promises = Array.from({ length: operations }, () =>
        cacheService.get('test-key')
      );

      const results = await Promise.all(promises);
      results.forEach(result => {
        expect(result).toBe('test-value');
      });
    });
  });
});
