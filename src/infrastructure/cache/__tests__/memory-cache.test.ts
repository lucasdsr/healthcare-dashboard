import { MemoryCache } from '../memory-cache';

describe('MemoryCache', () => {
  let cache: MemoryCache<string>;

  beforeEach(() => {
    cache = new MemoryCache<string>(100, 5 * 60 * 1000);
  });

  describe('constructor', () => {
    it('should create cache with default values', () => {
      const defaultCache = new MemoryCache<string>();
      expect(defaultCache).toBeInstanceOf(MemoryCache);
    });

    it('should create cache with custom values', () => {
      const customCache = new MemoryCache<string>(500, 10 * 60 * 1000);
      expect(customCache).toBeInstanceOf(MemoryCache);
    });
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      cache.set('key1', 'value1', 'encounters');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should handle different resource types', () => {
      cache.set('key1', 'value1', 'encounters');
      cache.set('key2', 'value2', 'patients');

      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
    });

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });
  });

  describe('TTL handling', () => {
    it('should expire data after TTL', async () => {
      cache.set('key1', 'value1', 'encounters', 100); // 100ms TTL

      expect(cache.get('key1')).toBe('value1');

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(cache.get('key1')).toBeNull();
    });

    it('should use strategy TTL when not specified', () => {
      cache.set('key1', 'value1', 'encounters'); // Uses encounters strategy TTL
      expect(cache.get('key1')).toBe('value1');
    });
  });

  describe('size management', () => {
    it('should respect max size limit', () => {
      const smallCache = new MemoryCache<string>(2, 5 * 60 * 1000);

      smallCache.set('key1', 'value1', 'encounters');
      smallCache.set('key2', 'value2', 'encounters');
      smallCache.set('key3', 'value3', 'encounters'); // Should trigger eviction

      expect(smallCache.getKeys().length).toBeLessThanOrEqual(2);
    });

    it('should evict lowest priority items first', () => {
      const smallCache = new MemoryCache<string>(2, 5 * 60 * 1000);

      // Add low priority item
      smallCache.set('low1', 'value1', 'organizations'); // low priority
      smallCache.set('high1', 'value2', 'encounters'); // high priority
      smallCache.set('high2', 'value3', 'encounters'); // high priority, should evict low priority

      expect(smallCache.get('low1')).toBeNull(); // Low priority item should be evicted
      expect(smallCache.get('high1')).toBe('value2'); // High priority items should remain
      expect(smallCache.get('high2')).toBe('value3');
    });
  });

  describe('utility methods', () => {
    it('should check if key exists', () => {
      cache.set('key1', 'value1', 'encounters');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should delete specific keys', () => {
      cache.set('key1', 'value1', 'encounters');
      cache.set('key2', 'value2', 'encounters');

      cache.delete('key1');

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
    });

    it('should clear all data', () => {
      cache.set('key1', 'value1', 'encounters');
      cache.set('key2', 'value2', 'encounters');

      cache.clear();

      expect(cache.getKeys().length).toBe(0);
    });

    it('should get all keys', () => {
      cache.set('key1', 'value1', 'encounters');
      cache.set('key2', 'value2', 'encounters');

      const keys = cache.getKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('filtering methods', () => {
    it('should filter by resource type', () => {
      cache.set('enc1', 'value1', 'encounters');
      cache.set('enc2', 'value2', 'encounters');
      cache.set('pat1', 'value3', 'patients');

      const encounters = cache.getByResourceType('encounters');
      expect(encounters).toHaveLength(2);
      expect(encounters).toContain('value1');
      expect(encounters).toContain('value2');
    });

    it('should filter by priority', () => {
      cache.set('high1', 'value1', 'encounters'); // high priority
      cache.set('high2', 'value2', 'patients'); // high priority
      cache.set('low1', 'value3', 'organizations'); // low priority

      const highPriority = cache.getByPriority('high');
      expect(highPriority).toHaveLength(2);

      const lowPriority = cache.getByPriority('low');
      expect(lowPriority).toHaveLength(1);
    });
  });

  describe('statistics', () => {
    it('should provide cache statistics', () => {
      cache.set('enc1', 'value1', 'encounters'); // high priority
      cache.set('enc2', 'value2', 'encounters'); // high priority
      cache.set('pat1', 'value3', 'patients'); // high priority

      const stats = cache.getStats();

      expect(stats.size).toBe(3);
      expect(stats.resourceTypeCounts.encounters).toBe(2);
      expect(stats.resourceTypeCounts.patients).toBe(1);
      expect(stats.priorityCounts.high).toBe(3); // encounters and patients are both high priority
      expect(stats.priorityCounts.low || 0).toBe(0); // handle undefined case
    });
  });
});
