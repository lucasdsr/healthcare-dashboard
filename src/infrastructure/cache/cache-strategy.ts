export interface CacheStrategy {
  ttl: number;
  maxSize: number;
  priority: 'high' | 'medium' | 'low';
}

export const CACHE_STRATEGIES: Record<string, CacheStrategy> = {
  encounters: {
    ttl: 5 * 60 * 1000,
    maxSize: 1000,
    priority: 'high',
  },
  patients: {
    ttl: 30 * 60 * 1000,
    maxSize: 5000,
    priority: 'high',
  },
  practitioners: {
    ttl: 60 * 60 * 1000,
    maxSize: 1000,
    priority: 'medium',
  },
  organizations: {
    ttl: 24 * 60 * 60 * 1000,
    maxSize: 100,
    priority: 'low',
  },
};

export const getCacheStrategy = (resourceType: string): CacheStrategy =>
  CACHE_STRATEGIES[resourceType] || {
    ttl: 15 * 60 * 1000,
    maxSize: 1000,
    priority: 'medium',
  };
