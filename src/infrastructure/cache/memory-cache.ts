import { CacheStrategy, getCacheStrategy } from './cache-strategy';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  resourceType: string;
  priority: 'high' | 'medium' | 'low';
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 1000, defaultTTL: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, resourceType: string, ttl?: number): void {
    this.cleanup();

    if (this.cache.size >= this.maxSize) {
      this.evictLowestPriority();
    }

    const strategy = getCacheStrategy(resourceType);
    const finalTTL = ttl || strategy.ttl;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: finalTTL,
      resourceType,
      priority: strategy.priority,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getKeys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  getStats(): {
    size: number;
    hitRate: number;
    resourceTypeCounts: Record<string, number>;
    priorityCounts: Record<string, number>;
  } {
    this.cleanup();

    const resourceTypeCounts: Record<string, number> = {};
    const priorityCounts: Record<string, number> = {};

    for (const entry of this.cache.values()) {
      resourceTypeCounts[entry.resourceType] =
        (resourceTypeCounts[entry.resourceType] || 0) + 1;
      priorityCounts[entry.priority] =
        (priorityCounts[entry.priority] || 0) + 1;
    }

    return {
      size: this.cache.size,
      hitRate: 0,
      resourceTypeCounts,
      priorityCounts,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictLowestPriority(): void {
    const priorityOrder = ['low', 'medium', 'high'];

    for (const priority of priorityOrder) {
      const keysToEvict = Array.from(this.cache.entries())
        .filter(([, entry]) => entry.priority === priority)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, Math.ceil(this.maxSize * 0.1));

      if (keysToEvict.length > 0) {
        keysToEvict.forEach(([key]) => this.cache.delete(key));
        break;
      }
    }
  }

  getByResourceType(resourceType: string): T[] {
    this.cleanup();
    const results: T[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.resourceType === resourceType) {
        results.push(entry.data);
      }
    }

    return results;
  }

  getByPriority(priority: 'high' | 'medium' | 'low'): T[] {
    this.cleanup();
    const results: T[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.priority === priority) {
        results.push(entry.data);
      }
    }

    return results;
  }
}
