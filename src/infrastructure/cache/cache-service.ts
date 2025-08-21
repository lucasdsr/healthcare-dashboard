export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  getKeys(): Promise<string[]>;
}

export interface CacheServiceEntry<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryCacheService implements CacheService {
  private cache = new Map<string, CacheServiceEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async getKeys(): Promise<string[]> {
    const now = Date.now();
    const validKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiresAt) {
        validKeys.push(key);
      } else {
        this.cache.delete(key);
      }
    }

    return validKeys;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; hitRate: number } {
    this.cleanup();
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to implement hit tracking for this
    };
  }
}

export class LocalStorageCacheService implements CacheService {
  private readonly prefix = 'healthcare_cache_';
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);

      if (!item) {
        return null;
      }

      const entry: CacheServiceEntry<T> = JSON.parse(item);

      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(fullKey);
        return null;
      }

      return entry.value;
    } catch (error) {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const expiresAt = Date.now() + (ttl || this.defaultTTL);
      const entry: CacheServiceEntry<T> = { value, expiresAt };

      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      // Local storage might be full or disabled
      console.warn('Failed to cache item:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      // Ignore errors
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getKeys();
      keys.forEach(key => {
        localStorage.removeItem(this.getFullKey(key));
      });
    } catch (error) {
      // Ignore errors
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);

      if (!item) {
        return false;
      }

      const entry: CacheServiceEntry<any> = JSON.parse(item);

      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(fullKey);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async getKeys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '');
          if (await this.has(cleanKey)) {
            keys.push(cleanKey);
          }
        }
      }
      return keys;
    } catch (error) {
      return [];
    }
  }
}
